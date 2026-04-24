"use client";

import React, { useRef, useState } from "react";
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, Avatar, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, StopOutlined } from "@ant-design/icons";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "member";
  status: "active" | "banned";
  comments: number;
  joinedAt: string;
  avatar?: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "a@mocphim.vn", role: "admin", status: "active", comments: 142, joinedAt: "01/01/2025" },
  { id: 2, name: "Trần Thị B", email: "b@mocphim.vn", role: "editor", status: "active", comments: 98, joinedAt: "15/02/2025" },
  { id: 3, name: "Lê Văn C", email: "c@mocphim.vn", role: "member", status: "active", comments: 76, joinedAt: "10/03/2025" },
  { id: 4, name: "Phạm Thị D", email: "d@mocphim.vn", role: "member", status: "banned", comments: 54, joinedAt: "05/04/2025" },
  { id: 5, name: "Hoàng Văn E", email: "e@mocphim.vn", role: "member", status: "active", comments: 32, joinedAt: "12/04/2025" },
  { id: 6, name: "Ngô Thị F", email: "f@mocphim.vn", role: "editor", status: "active", comments: 21, joinedAt: "18/04/2025" },
];

const roleMap: Record<string, { text: string; color: string }> = {
  admin: { text: "Admin", color: "red" },
  editor: { text: "Editor", color: "blue" },
  member: { text: "Thành viên", color: "default" },
};

export default function NguoiDungPage() {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const { message } = App.useApp();

  const columns: ProColumns<User>[] = [
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1677ff" }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      valueType: "select",
      valueEnum: {
        admin: { text: "Admin" },
        editor: { text: "Editor" },
        member: { text: "Thành viên" },
      },
      render: (_, record) => (
        <Tag color={roleMap[record.role].color}>{roleMap[record.role].text}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        active: { text: "Hoạt động", status: "Success" },
        banned: { text: "Đã khoá", status: "Error" },
      },
      render: (_, record) => (
        <Tag color={record.status === "active" ? "success" : "error"}>
          {record.status === "active" ? "Hoạt động" : "Đã khoá"}
        </Tag>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "comments",
      search: false,
      sorter: (a, b) => a.comments - b.comments,
    },
    {
      title: "Ngày tham gia",
      dataIndex: "joinedAt",
      search: false,
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
            icon={<EditOutlined />}
            onClick={() => message.info(`Sửa: ${record.name}`)}
          />
          <Popconfirm
            title={record.status === "active" ? "Khoá tài khoản này?" : "Mở khoá tài khoản?"}
            okText="Xác nhận"
            cancelText="Huỷ"
            onConfirm={() => message.success("Đã cập nhật trạng thái")}
          >
            <Button
              type="link"
              size="small"
              danger={record.status === "active"}
              icon={<StopOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Xoá tài khoản này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => message.success("Đã xoá tài khoản")}
          >
            <Button danger type="link" size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý Người dùng">
      <ProTable<User>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          let data = [...mockUsers];
          if (params.name)
            data = data.filter(
              (u) =>
                u.name.toLowerCase().includes(params.name.toLowerCase()) ||
                u.email.toLowerCase().includes(params.name.toLowerCase())
            );
          if (params.role) data = data.filter((u) => u.role === params.role);
          if (params.status) data = data.filter((u) => u.status === params.status);
          return { data, success: true, total: data.length };
        }}
        rowSelection={{}}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Thêm người dùng
          </Button>,
        ]}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <ModalForm
        title="Thêm người dùng"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onFinish={async (values) => {
          console.log(values);
          message.success("Đã tạo tài khoản thành công!");
          return true;
        }}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="Họ và tên" rules={[{ required: true }]} />
        <ProFormText
          name="email"
          label="Email"
          rules={[{ required: true }, { type: "email", message: "Email không hợp lệ" }]}
        />
        <ProFormText.Password
          name="password"
          label="Mật khẩu"
          rules={[{ required: true }, { min: 8, message: "Tối thiểu 8 ký tự" }]}
        />
        <ProFormSelect
          name="role"
          label="Vai trò"
          options={[
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Thành viên", value: "member" },
          ]}
          initialValue="member"
        />
      </ModalForm>
    </PageContainer>
  );
}
