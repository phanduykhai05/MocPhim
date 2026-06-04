"use client";

import { useRef, useState } from "react";
import { PageContainer, ProCard, ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  App, Button, Form, Input, Modal, Popconfirm, Space, Tag, Tooltip,
} from "antd";
import { LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
import {
  apiGetAdminUsers, apiToggleUserStatus,
  type AdminUser,
} from "@/lib/api/admin";

function getRoleTag(roles: string[]) {
  if (roles.includes("ROLE_ADMIN")) return <Tag color="red">Admin</Tag>;
  if (roles.includes("ROLE_EDITOR")) return <Tag color="blue">Editor</Tag>;
  return <Tag>Thành viên</Tag>;
}

export default function KhoaTaiKhoanPage() {
  const { message } = App.useApp();
  const activeRef = useRef<ActionType | undefined>(undefined);
  const lockedRef = useRef<ActionType | undefined>(undefined);

  // Modal nhập lý do khoá
  const [lockTarget, setLockTarget] = useState<AdminUser | null>(null);
  const [lockReason, setLockReason] = useState("");
  const [locking, setLocking] = useState(false);

  async function confirmLock() {
    if (!lockTarget) return;
    setLocking(true);
    try {
      await apiToggleUserStatus(lockTarget.id, false);
      message.success(`Đã khoá: ${lockTarget.name}`);
      setLockTarget(null);
      setLockReason("");
      activeRef.current?.reload();
      lockedRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Khoá thất bại");
    } finally {
      setLocking(false);
    }
  }

  async function handleUnlock(record: AdminUser) {
    try {
      await apiToggleUserStatus(record.id, true);
      message.success(`Đã mở khoá: ${record.name}`);
      activeRef.current?.reload();
      lockedRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Mở khoá thất bại");
    }
  }

  const activeColumns: ProColumns<AdminUser>[] = [
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (_, r) => (
        <Space>
          <UserOutlined style={{ color: "#1677ff" }} />
          <div>
            <div style={{ fontWeight: 500 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>{r.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      search: false,
      render: (_, r) => getRoleTag(r.roles ?? []),
    },
    {
      title: "Xác thực",
      dataIndex: "isVerified",
      search: false,
      render: (_, r) => (
        <Tag color={r.isVerified ? "blue" : "default"}>
          {r.isVerified ? "Đã xác thực" : "Chưa xác thực"}
        </Tag>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      search: false,
      render: (_, r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 100,
      render: (_, r) => {
        const isSuperAdmin = r.email === "admin@mocphim.com";
        return (
          <Tooltip title={isSuperAdmin ? "Tài khoản superadmin được bảo vệ" : "Khoá tài khoản"}>
            <Button
              type="link" size="small" danger icon={<LockOutlined />}
              disabled={isSuperAdmin}
              onClick={() => { if (!isSuperAdmin) { setLockTarget(r); setLockReason(""); } }}
            >
              Khoá
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  const lockedColumns: ProColumns<AdminUser>[] = [
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (_, r) => (
        <Space>
          <LockOutlined style={{ color: "#ff4d4f" }} />
          <div>
            <div style={{ fontWeight: 500 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>{r.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      search: false,
      render: (_, r) => getRoleTag(r.roles ?? []),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      search: false,
      render: (_, r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 110,
      render: (_, r) => {
        const isSuperAdmin = r.email === "admin@mocphim.com";
        return (
          <Tooltip title={isSuperAdmin ? "Tài khoản superadmin được bảo vệ" : undefined}>
            <Popconfirm
              title="Mở khoá tài khoản này?"
              description="Người dùng có thể đăng nhập trở lại."
              okText="Mở khoá" cancelText="Huỷ"
              disabled={isSuperAdmin}
              onConfirm={() => handleUnlock(r)}
            >
              <Button type="link" size="small" icon={<UnlockOutlined />} disabled={isSuperAdmin}>
                Mở khoá
              </Button>
            </Popconfirm>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <PageContainer title="Khoá tài khoản" subTitle="Khoá / mở khoá tài khoản người dùng">
      <ProCard title="Đang hoạt động" bordered style={{ marginBottom: 16 }}>
        <ProTable<AdminUser>
          actionRef={activeRef}
          rowKey="id"
          columns={activeColumns}
          request={async (params) => {
            try {
              const res = await apiGetAdminUsers({
                page: params.current,
                pageSize: params.pageSize,
                name: params.name as string | undefined,
                enabled: true,
              });
              return { data: res.data, success: true, total: res.total };
            } catch {
              return { data: [], success: false, total: 0 };
            }
          }}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          search={{ labelWidth: "auto" }}
        />
      </ProCard>

      <ProCard title="Đã bị khoá" bordered>
        <ProTable<AdminUser>
          actionRef={lockedRef}
          rowKey="id"
          columns={lockedColumns}
          request={async (params) => {
            try {
              const res = await apiGetAdminUsers({
                page: params.current,
                pageSize: params.pageSize,
                name: params.name as string | undefined,
                enabled: false,
              });
              return { data: res.data, success: true, total: res.total };
            } catch {
              return { data: [], success: false, total: 0 };
            }
          }}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          search={{ labelWidth: "auto" }}
        />
      </ProCard>

      {/* ── Modal nhập lý do khoá ─────────────────────────────────────────────── */}
      <Modal
        title={<Space><LockOutlined style={{ color: "#ff4d4f" }} /> Khoá tài khoản</Space>}
        open={!!lockTarget}
        onCancel={() => setLockTarget(null)}
        onOk={confirmLock}
        okText="Xác nhận khoá"
        okButtonProps={{ danger: true, loading: locking }}
        cancelText="Huỷ"
        destroyOnHidden
      >
        {lockTarget && (
          <div>
            <p>
              Bạn sắp khoá tài khoản{" "}
              <strong>{lockTarget.name}</strong>{" "}
              (<span style={{ color: "#8c8c8c" }}>{lockTarget.email}</span>).
              Người dùng sẽ bị đăng xuất ngay lập tức và không thể đăng nhập lại.
            </p>
            <Form layout="vertical" style={{ marginTop: 12 }}>
              <Form.Item label="Lý do khoá (tuỳ chọn)">
                <Input.TextArea
                  rows={3}
                  placeholder="VD: Vi phạm điều khoản sử dụng..."
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
