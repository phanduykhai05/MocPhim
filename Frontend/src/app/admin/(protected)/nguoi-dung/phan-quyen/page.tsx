"use client";

import React, { useState } from "react";
import { PageContainer, ProCard, ProTable, ProForm, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Button, Drawer, Popconfirm, Space, Tag } from "antd";

type RoleItem = {
  id: number;
  role: "admin" | "editor" | "user";
  description: string;
  userCount: number;
  canManageUsers: boolean;
  canManageMovies: boolean;
  canManageAds: boolean;
  canManageRevenue: boolean;
  canManageSeo: boolean;
};

const initialRoles: RoleItem[] = [
  {
    id: 1,
    role: "admin",
    description: "Toàn quyền hệ thống",
    userCount: 2,
    canManageUsers: true,
    canManageMovies: true,
    canManageAds: true,
    canManageRevenue: true,
    canManageSeo: true,
  },
  {
    id: 2,
    role: "editor",
    description: "Quản trị nội dung phim",
    userCount: 6,
    canManageUsers: false,
    canManageMovies: true,
    canManageAds: false,
    canManageRevenue: false,
    canManageSeo: true,
  },
  {
    id: 3,
    role: "user",
    description: "Người dùng thông thường",
    userCount: 1834,
    canManageUsers: false,
    canManageMovies: false,
    canManageAds: false,
    canManageRevenue: false,
    canManageSeo: false,
  },
];

export default function PhanQuyenPage() {
  const { message } = App.useApp();
  const [roles, setRoles] = useState<RoleItem[]>(initialRoles);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  const columns: ProColumns<RoleItem>[] = [
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (_, record) => {
        const map = {
          admin: { color: "red", text: "Admin" },
          editor: { color: "blue", text: "Editor" },
          user: { color: "default", text: "User" },
        } as const;
        return <Tag color={map[record.role].color}>{map[record.role].text}</Tag>;
      },
    },
    { title: "Mô tả", dataIndex: "description" },
    { title: "Số tài khoản", dataIndex: "userCount", search: false },
    {
      title: "Quản lý users",
      dataIndex: "canManageUsers",
      search: false,
      render: (v) => <Tag color={v ? "success" : "default"}>{v ? "Có" : "Không"}</Tag>,
    },
    {
      title: "Nội dung phim",
      dataIndex: "canManageMovies",
      search: false,
      render: (v) => <Tag color={v ? "success" : "default"}>{v ? "Có" : "Không"}</Tag>,
    },
    {
      title: "Quảng cáo",
      dataIndex: "canManageAds",
      search: false,
      render: (v) => <Tag color={v ? "success" : "default"}>{v ? "Có" : "Không"}</Tag>,
    },
    {
      title: "Doanh thu",
      dataIndex: "canManageRevenue",
      search: false,
      render: (v) => <Tag color={v ? "success" : "default"}>{v ? "Có" : "Không"}</Tag>,
    },
    {
      title: "SEO",
      dataIndex: "canManageSeo",
      search: false,
      render: (v) => <Tag color={v ? "success" : "default"}>{v ? "Có" : "Không"}</Tag>,
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditingRole(record);
              setDrawerOpen(true);
            }}
          >
            Chỉnh quyền
          </Button>
          <Popconfirm
            title="Nhân bản role này?"
            okText="Nhân bản"
            cancelText="Hủy"
            onConfirm={() => message.success("Đã nhân bản role")}
          >
            <Button type="link" size="small">Nhân bản</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Phân quyền" subTitle="Admin / Editor / User">
      <ProCard title="Thiết lập phân quyền nhanh" bordered>
        <ProForm
          layout="vertical"
          initialValues={{
            enableRoleBasedAccess: true,
            enforceStrongPolicyForAdmin: true,
            requireApproveRoleChange: true,
          }}
          onFinish={async (values) => {
            console.log(values);
            message.success("Đã lưu cấu hình phân quyền");
          }}
          submitter={{ searchConfig: { submitText: "Lưu cấu hình" } }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1">
            <ProFormSwitch name="enableRoleBasedAccess" label="Bật RBAC theo vai trò" />
            <ProFormSwitch name="enforceStrongPolicyForAdmin" label="Admin bắt buộc chính sách mạnh" />
            <ProFormSwitch name="requireApproveRoleChange" label="Đổi role cần xác nhận" />
          </div>
        </ProForm>
      </ProCard>

      <ProCard title="Ma trận quyền theo vai trò" bordered style={{ marginTop: 16 }}>
        <ProTable<RoleItem>
          rowKey="id"
          columns={columns}
          request={async () => ({ data: roles, success: true, total: roles.length })}
          search={false}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1200 }}
        />
      </ProCard>

      <Drawer
        title={`Chỉnh quyền vai trò: ${editingRole?.role?.toUpperCase() || "-"}`}
        placement="right"
        width={460}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
      >
        {editingRole && (
          <ProForm
            layout="vertical"
            key={editingRole.id}
            initialValues={editingRole}
            onFinish={async (values) => {
              setRoles((prev) =>
                prev.map((item) =>
                  item.id === editingRole.id
                    ? {
                        ...item,
                        description: String(values.description),
                        canManageUsers: Boolean(values.canManageUsers),
                        canManageMovies: Boolean(values.canManageMovies),
                        canManageAds: Boolean(values.canManageAds),
                        canManageRevenue: Boolean(values.canManageRevenue),
                        canManageSeo: Boolean(values.canManageSeo),
                      }
                    : item
                )
              );
              message.success("Đã cập nhật quyền thành công");
              setDrawerOpen(false);
            }}
            submitter={{ searchConfig: { submitText: "Lưu quyền", resetText: "Khôi phục" } }}
          >
            <ProFormText name="role" label="Vai trò" readonly />
            <ProFormText name="description" label="Mô tả vai trò" rules={[{ required: true }]} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
              <ProFormSwitch name="canManageUsers" label="Quản lý users" />
              <ProFormSwitch name="canManageMovies" label="Quản lý nội dung phim" />
              <ProFormSwitch name="canManageAds" label="Quản lý quảng cáo" />
              <ProFormSwitch name="canManageRevenue" label="Quản lý doanh thu" />
              <ProFormSwitch name="canManageSeo" label="Quản lý SEO & sitemap" />
            </div>
          </ProForm>
        )}
      </Drawer>
    </PageContainer>
  );
}
