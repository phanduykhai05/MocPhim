"use client";

import React, { useState } from "react";
import { PageContainer, ProCard, ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Space, Tag } from "antd";

type ActiveUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "user";
  lastLogin: string;
};

type LockedUser = {
  id: number;
  name: string;
  email: string;
  reason: string;
  lockedBy: string;
  lockedAt: string;
};

const activeSeed: ActiveUser[] = [
  { id: 1, name: "Nguyen Van A", email: "a@mocphim.vn", role: "admin", lastLogin: "06/05/2026 09:20" },
  { id: 2, name: "Tran Thi B", email: "b@mocphim.vn", role: "editor", lastLogin: "06/05/2026 08:01" },
  { id: 3, name: "Le Van C", email: "c@mocphim.vn", role: "user", lastLogin: "05/05/2026 23:49" },
  { id: 4, name: "Pham Thi D", email: "d@mocphim.vn", role: "user", lastLogin: "05/05/2026 22:17" },
];

const lockedSeed: LockedUser[] = [
  {
    id: 1001,
    name: "Vo Van E",
    email: "e@mocphim.vn",
    reason: "Đăng nhập sai nhiều lần",
    lockedBy: "admin@mocphim.vn",
    lockedAt: "04/05/2026 18:15",
  },
];

export default function KhoaTaiKhoanPage() {
  const { message } = App.useApp();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>(activeSeed);
  const [lockedUsers, setLockedUsers] = useState<LockedUser[]>(lockedSeed);

  const activeColumns: ProColumns<ActiveUser>[] = [
    { title: "Họ tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
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
    { title: "Đăng nhập cuối", dataIndex: "lastLogin", search: false },
    {
      title: "Thao tác",
      valueType: "option",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Khóa tài khoản này?"
          description="Người dùng sẽ không thể đăng nhập."
          okText="Khóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          onConfirm={() => {
            const locked: LockedUser = {
              id: record.id,
              name: record.name,
              email: record.email,
              reason: "Khóa thủ công bởi quản trị viên",
              lockedBy: "admin@mocphim.vn",
              lockedAt: new Date().toLocaleString("vi-VN"),
            };
            setActiveUsers((prev) => prev.filter((u) => u.id !== record.id));
            setLockedUsers((prev) => [locked, ...prev]);
            message.success(`Đã khóa: ${record.name}`);
          }}
        >
          <Button type="link" size="small" danger>
            Khóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const lockedColumns: ProColumns<LockedUser>[] = [
    { title: "Họ tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Lý do", dataIndex: "reason", ellipsis: true },
    { title: "Khóa bởi", dataIndex: "lockedBy", search: false },
    { title: "Thời gian khóa", dataIndex: "lockedAt", search: false },
    {
      title: "Thao tác",
      valueType: "option",
      width: 100,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Mở khóa tài khoản này?"
            okText="Mở khóa"
            cancelText="Hủy"
            onConfirm={() => {
              const restore: ActiveUser = {
                id: record.id,
                name: record.name,
                email: record.email,
                role: "user",
                lastLogin: "-",
              };
              setLockedUsers((prev) => prev.filter((u) => u.id !== record.id));
              setActiveUsers((prev) => [restore, ...prev]);
              message.success(`Đã mở khóa: ${record.name}`);
            }}
          >
            <Button type="link" size="small">Mở khóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Khóa tài khoản" subTitle="Khóa/mở khóa tài khoản người dùng">
      <ProCard title="Danh sách người dùng đang hoạt động" bordered>
        <ProTable<ActiveUser>
          rowKey="id"
          columns={activeColumns}
          dataSource={activeUsers}
          request={async () => ({ data: activeUsers, success: true, total: activeUsers.length })}
          pagination={{ pageSize: 8 }}
        />
      </ProCard>

      <ProCard title="Tài khoản đã khóa" bordered style={{ marginTop: 16 }}>
        <ProTable<LockedUser>
          rowKey="id"
          columns={lockedColumns}
          dataSource={lockedUsers}
          request={async () => ({ data: lockedUsers, success: true, total: lockedUsers.length })}
          pagination={{ pageSize: 8 }}
        />
      </ProCard>
    </PageContainer>
  );
}
