"use client";

import { useRef, useState } from "react";
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
import { apiGetAdminUsers, type AdminUser } from "@/lib/api/admin";

function getRoleTag(roles: string[]) {
  if (roles.includes("ROLE_ADMIN")) return <Tag color="red">Admin</Tag>;
  if (roles.includes("ROLE_EDITOR")) return <Tag color="blue">Editor</Tag>;
  return <Tag>Thành viên</Tag>;
}

export default function NguoiDungPage() {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const { message } = App.useApp();

  const columns: ProColumns<AdminUser>[] = [
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} style={{ backgroundColor: "#1677ff" }}>
            {record.name?.charAt(0)}
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
      dataIndex: "roles",
      search: false,
      render: (_, record) => getRoleTag(record.roles ?? []),
    },
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      valueType: "select",
      search: false,
      render: (_, record) => (
        <Tag color={record.enabled ? "success" : "error"}>
          {record.enabled ? "Hoạt động" : "Đã khoá"}
        </Tag>
      ),
    },
    {
      title: "Xác thực",
      dataIndex: "isVerified",
      search: false,
      render: (_, record) => (
        <Tag color={record.isVerified ? "blue" : "default"}>
          {record.isVerified ? "Đã xác thực" : "Chưa xác thực"}
        </Tag>
      ),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      search: false,
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      search: false,
      render: (_, record) =>
        record.createdAt ? new Date(record.createdAt).toLocaleDateString("vi-VN") : "—",
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
            title={record.enabled ? "Khoá tài khoản này?" : "Mở khoá tài khoản?"}
            okText="Xác nhận"
            cancelText="Huỷ"
            onConfirm={() => message.success("Đã cập nhật trạng thái")}
          >
            <Button
              type="link"
              size="small"
              danger={record.enabled}
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
    <PageContainer title="Danh sách user" subTitle="Quản lý danh sách tài khoản người dùng hệ thống">
      <ProTable<AdminUser>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          try {
            const result = await apiGetAdminUsers({
              page: params.current,
              pageSize: params.pageSize,
              name: params.name as string | undefined,
            });
            return { data: result.data, success: true, total: result.total };
          } catch (err) {
            message.error(
              err instanceof Error ? err.message : "Không thể tải danh sách người dùng",
            );
            return { data: [], success: false, total: 0 };
          }
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
        search={{ labelWidth: "auto" }}
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
        modalProps={{ destroyOnHidden: true }}
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
            { label: "Admin", value: "ROLE_ADMIN" },
            { label: "Editor", value: "ROLE_EDITOR" },
            { label: "Thành viên", value: "ROLE_USER" },
          ]}
          initialValue="ROLE_USER"
        />
      </ModalForm>
    </PageContainer>
  );
}
