"use client";

import { useEffect, useRef, useState } from "react";
import {
  PageContainer, ProCard, ProTable, ProForm,
  ProFormSwitch, ProFormText, StatisticCard,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  App, Button, Drawer, Space, Tag, Form,
  Switch, Tooltip, Spin,
} from "antd";
import { EditOutlined, TeamOutlined, UserOutlined, CrownOutlined } from "@ant-design/icons";
import {
  apiGetRoleStats, apiUpdateUser, apiGetAdminUsers,
  type AdminUser, type RoleStats,
} from "@/lib/api/admin";

const ROLE_COLOR: Record<string, string> = {
  ROLE_ADMIN: "red",
  ROLE_EDITOR: "blue",
  ROLE_USER: "default",
};
const ROLE_LABEL: Record<string, string> = {
  ROLE_ADMIN: "Admin",
  ROLE_EDITOR: "Editor",
  ROLE_USER: "Thành viên",
};

const PERMISSIONS = [
  { key: "canManageUsers",   label: "Quản lý người dùng",   roles: ["ROLE_ADMIN"] },
  { key: "canManageMovies",  label: "Quản lý nội dung phim", roles: ["ROLE_ADMIN", "ROLE_EDITOR"] },
  { key: "canManageAds",     label: "Quản lý quảng cáo",    roles: ["ROLE_ADMIN"] },
  { key: "canManageRevenue", label: "Quản lý doanh thu",     roles: ["ROLE_ADMIN"] },
  { key: "canManageSeo",     label: "Quản lý SEO & sitemap", roles: ["ROLE_ADMIN", "ROLE_EDITOR"] },
  { key: "canImportMovie",   label: "Import / Crawl phim",   roles: ["ROLE_ADMIN", "ROLE_EDITOR"] },
  { key: "viewDashboard",    label: "Xem Dashboard",         roles: ["ROLE_ADMIN", "ROLE_EDITOR"] },
];

export default function PhanQuyenPage() {
  const { message } = App.useApp();
  const tableRef = useRef<ActionType | undefined>(undefined);

  const [stats, setStats] = useState<RoleStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Edit role drawer
  const [editing, setEditing]   = useState<AdminUser | null>(null);
  const [saving, setSaving]     = useState(false);
  const [roleForm] = Form.useForm<{ roles: string[] }>();

  useEffect(() => {
    apiGetRoleStats()
      .then(setStats)
      .catch(() => message.error("Không tải được thống kê vai trò"))
      .finally(() => setLoadingStats(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveRole() {
    if (!editing) return;
    try {
      const { roles } = await roleForm.validateFields();
      setSaving(true);
      await apiUpdateUser(editing.id, { roles });
      message.success(`Đã cập nhật vai trò: ${editing.name}`);
      setEditing(null);
      tableRef.current?.reload();
      // refresh stats
      apiGetRoleStats().then(setStats).catch(() => {});
    } catch (err) {
      if (err instanceof Error) message.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const columns: ProColumns<AdminUser>[] = [
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (_, r) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{r.name}</span>
          <span style={{ color: "#8c8c8c", fontSize: 12 }}>{r.email}</span>
        </Space>
      ),
    },
    {
      title: "Vai trò hiện tại",
      dataIndex: "roles",
      search: false,
      render: (_, r) =>
        (r.roles ?? []).map((role) => (
          <Tag key={role} color={ROLE_COLOR[role] ?? "default"}>
            {ROLE_LABEL[role] ?? role}
          </Tag>
        )),
    },
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      search: false,
      render: (_, r) => (
        <Tag color={r.enabled ? "success" : "error"}>
          {r.enabled ? "Hoạt động" : "Đã khoá"}
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
      title: "Đổi vai trò",
      valueType: "option",
      width: 110,
      render: (_, r) => (
        <Tooltip title="Đổi vai trò">
          <Button
            type="link" size="small" icon={<EditOutlined />}
            onClick={() => {
              setEditing(r);
              roleForm.setFieldsValue({ roles: r.roles ?? [] });
            }}
          >
            Phân quyền
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <PageContainer title="Phân quyền" subTitle="Quản lý vai trò Admin / Editor / Thành viên">

      {/* ── Thống kê ──────────────────────────────────────────────────────────── */}
      <ProCard ghost gutter={[16, 16]} wrap style={{ marginBottom: 16 }}>
        <ProCard colSpan={{ xs: 24, sm: 8 }} bordered>
          <StatisticCard loading={loadingStats} statistic={{
            title: "Admin", value: stats?.admin ?? 0,
            icon: <CrownOutlined style={{ color: "#ff4d4f" }} />,
          }} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 8 }} bordered>
          <StatisticCard loading={loadingStats} statistic={{
            title: "Editor", value: stats?.editor ?? 0,
            icon: <EditOutlined style={{ color: "#1677ff" }} />,
          }} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 8 }} bordered>
          <StatisticCard loading={loadingStats} statistic={{
            title: "Thành viên", value: stats?.user ?? 0,
            icon: <UserOutlined style={{ color: "#52c41a" }} />,
          }} />
        </ProCard>
      </ProCard>

      {/* ── Ma trận quyền ────────────────────────────────────────────────────── */}
      <ProCard title="Ma trận quyền theo vai trò" bordered style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--ant-color-fill-tertiary, #f5f5f5)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600 }}>Quyền</th>
                {["Admin", "Editor", "Thành viên"].map((role) => (
                  <th key={role} style={{ padding: "10px 24px", textAlign: "center", fontWeight: 600 }}>{role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm, i) => (
                <tr key={perm.key} style={{ background: i % 2 === 0 ? "transparent" : "var(--ant-color-fill-quaternary, #fafafa)" }}>
                  <td style={{ padding: "8px 16px" }}>{perm.label}</td>
                  {(["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_USER"] as const).map((role) => (
                    <td key={role} style={{ textAlign: "center", padding: "8px 24px" }}>
                      <Switch
                        size="small"
                        checked={perm.roles.includes(role)}
                        disabled
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProCard>

      {/* ── Bảng người dùng & đổi role ───────────────────────────────────────── */}
      <ProCard title="Danh sách người dùng" bordered>
        <ProTable<AdminUser>
          actionRef={tableRef}
          rowKey="id"
          columns={columns}
          request={async (params) => {
            try {
              const res = await apiGetAdminUsers({
                page: params.current,
                pageSize: params.pageSize,
                name: params.name as string | undefined,
              });
              return { data: res.data, success: true, total: res.total };
            } catch {
              return { data: [], success: false, total: 0 };
            }
          }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          search={{ labelWidth: "auto" }}
        />
      </ProCard>

      {/* ── Drawer đổi vai trò ───────────────────────────────────────────────── */}
      <Drawer
        title={`Phân quyền: ${editing?.name ?? ""}`}
        placement="right"
        width={420}
        open={!!editing}
        onClose={() => setEditing(null)}
        destroyOnHidden
        footer={
          <Space style={{ justifyContent: "flex-end", display: "flex" }}>
            <Button onClick={() => setEditing(null)}>Huỷ</Button>
            <Button type="primary" loading={saving} onClick={handleSaveRole}>
              Lưu vai trò
            </Button>
          </Space>
        }
      >
        {editing && (
          <Form form={roleForm} layout="vertical">
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 500 }}>{editing.name}</span>
              <span style={{ color: "#8c8c8c", fontSize: 12, marginLeft: 8 }}>{editing.email}</span>
            </div>
            <Form.Item name="roles" label="Vai trò" rules={[{ required: true, message: "Chọn ít nhất một vai trò" }]}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_USER"] as const).map((role) => (
                  <Form.Item key={role} noStyle shouldUpdate>
                    {({ getFieldValue, setFieldValue }) => {
                      const current: string[] = getFieldValue("roles") ?? [];
                      const checked = current.includes(role);
                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Switch
                            checked={checked}
                            onChange={(val) => {
                              const next = val
                                ? [...current, role]
                                : current.filter((r) => r !== role);
                              setFieldValue("roles", next);
                            }}
                          />
                          <Tag color={ROLE_COLOR[role]}>{ROLE_LABEL[role]}</Tag>
                          <span style={{ fontSize: 12, color: "#8c8c8c" }}>
                            {role === "ROLE_ADMIN" && "Toàn quyền hệ thống"}
                            {role === "ROLE_EDITOR" && "Quản lý nội dung phim & SEO"}
                            {role === "ROLE_USER" && "Người dùng thông thường"}
                          </span>
                        </div>
                      );
                    }}
                  </Form.Item>
                ))}
              </div>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </PageContainer>
  );
}
