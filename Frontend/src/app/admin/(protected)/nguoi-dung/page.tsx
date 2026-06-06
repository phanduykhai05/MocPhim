"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  Button, Tag, Space, Popconfirm, Avatar, App,
  Drawer, Form, Input, Select, Tooltip, Badge,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  StopOutlined, UnlockOutlined, UserOutlined,
  CheckCircleOutlined, SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  apiGetAdminUsers, apiCreateUser, apiUpdateUser,
  apiToggleUserStatus, apiDeleteUser,
  apiVerifyUser, apiBulkVerifyUsers,
  type AdminUser,
} from "@/lib/api/admin";

const ROLE_OPTIONS = [
  { label: "Admin", value: "ROLE_ADMIN" },
  { label: "Editor", value: "ROLE_EDITOR" },
  { label: "Thành viên", value: "ROLE_USER" },
];

function getRoleTag(roles: string[]) {
  if (roles.includes("ROLE_ADMIN")) return <Tag color="red">Admin</Tag>;
  if (roles.includes("ROLE_EDITOR")) return <Tag color="blue">Editor</Tag>;
  return <Tag color="default">Thành viên</Tag>;
}

export default function NguoiDungPage() {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const { message } = App.useApp();
  const { user: me } = useAuth();

  // ── Create modal ─────────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);

  // ── Edit drawer ──────────────────────────────────────────────────────────────
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  // ── Row selection for bulk actions ───────────────────────────────────────────
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  function openEdit(record: AdminUser) {
    setEditUser(record);
    editForm.setFieldsValue({ name: record.name, email: record.email, roles: record.roles });
  }

  async function handleEditSave() {
    if (!editUser) return;
    try {
      const values = await editForm.validateFields();
      setEditLoading(true);
      await apiUpdateUser(editUser.id, { name: values.name, email: values.email, roles: values.roles });
      message.success("Đã cập nhật thông tin người dùng");
      setEditUser(null);
      actionRef.current?.reload();
    } catch (err) {
      if (err instanceof Error) message.error(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  // ── Verify single ─────────────────────────────────────────────────────────────
  async function handleVerify(record: AdminUser) {
    try {
      await apiVerifyUser(record.id);
      message.success(`Đã xác minh tài khoản ${record.name}`);
      actionRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Xác minh thất bại");
    }
  }

  // ── Bulk verify ───────────────────────────────────────────────────────────────
  async function handleBulkVerify() {
    if (selectedKeys.length === 0) return;
    try {
      setBulkLoading(true);
      const result = await apiBulkVerifyUsers(selectedKeys);
      message.success(`Đã xác minh ${result.verified} tài khoản`);
      setSelectedKeys([]);
      actionRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Xác minh hàng loạt thất bại");
    } finally {
      setBulkLoading(false);
    }
  }

  // ── Toggle block ─────────────────────────────────────────────────────────────
  async function handleToggleStatus(record: AdminUser) {
    try {
      await apiToggleUserStatus(record.id, !record.enabled);
      message.success(record.enabled ? "Đã khoá tài khoản" : "Đã mở khoá tài khoản");
      actionRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Thao tác thất bại");
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  async function handleDelete(record: AdminUser) {
    try {
      await apiDeleteUser(record.id);
      message.success("Đã xoá tài khoản");
      actionRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Xoá thất bại");
    }
  }

  // ── Columns ──────────────────────────────────────────────────────────────────
  const columns: ProColumns<AdminUser>[] = [
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.avatar}
            icon={!record.avatar ? <UserOutlined /> : undefined}
            style={{ backgroundColor: "#1677ff" }}
          >
            {!record.avatar ? record.name?.charAt(0).toUpperCase() : undefined}
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
      search: false,
      render: (_, record) => (
        <Tag color={record.enabled ? "success" : "error"}>
          {record.enabled ? "Hoạt động" : "Đã khoá"}
        </Tag>
      ),
    },
    {
      title: "Xác thực email",
      dataIndex: "isVerified",
      valueType: "select",
      valueEnum: {
        true: { text: "Đã xác thực" },
        false: { text: "Chưa xác thực" },
      },
      render: (_, record) =>
        record.isVerified ? (
          <Tag icon={<CheckCircleOutlined />} color="blue">Đã xác thực</Tag>
        ) : (
          <Tag color="warning">Chưa xác thực</Tag>
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
      width: 160,
      render: (_, record) => {
        const isSelf = !!me?.id && String(me.id) === String(record.id);
        const isSuperAdmin = record.email === "admin@mocphim.com";
        const isLocked = isSelf || isSuperAdmin;
        return (
          <Space>
            {/* Verify — chỉ hiện khi chưa xác thực */}
            {!record.isVerified && (
              <Tooltip title="Xác minh email thủ công">
                <Popconfirm
                  title="Xác minh tài khoản này?"
                  description="Người dùng sẽ có thể đăng nhập ngay sau khi xác minh."
                  okText="Xác minh"
                  cancelText="Huỷ"
                  onConfirm={() => handleVerify(record)}
                >
                  <Button
                    type="link"
                    size="small"
                    icon={<SafetyCertificateOutlined />}
                    style={{ color: "#52c41a" }}
                  />
                </Popconfirm>
              </Tooltip>
            )}

            <Tooltip title={isSuperAdmin ? "Tài khoản superadmin được bảo vệ" : isSelf ? "Không thể tự sửa tài khoản" : "Chỉnh sửa"}>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                disabled={isLocked}
                onClick={() => openEdit(record)}
              />
            </Tooltip>

            <Tooltip title={isSelf ? "Không thể tự khoá" : record.enabled ? "Khoá tài khoản" : "Mở khoá"}>
              <Popconfirm
                title={record.enabled ? "Khoá tài khoản này?" : "Mở khoá tài khoản này?"}
                description={record.enabled ? "Người dùng sẽ không thể đăng nhập." : "Người dùng có thể đăng nhập trở lại."}
                okText="Xác nhận"
                cancelText="Huỷ"
                okButtonProps={{ danger: record.enabled }}
                disabled={isLocked}
                onConfirm={() => handleToggleStatus(record)}
              >
                <Button
                  type="link"
                  size="small"
                  danger={record.enabled}
                  disabled={isLocked}
                  icon={record.enabled ? <StopOutlined /> : <UnlockOutlined />}
                />
              </Popconfirm>
            </Tooltip>

            <Tooltip title={isSelf ? "Không thể tự xoá" : "Xoá tài khoản"}>
              <Popconfirm
                title="Xoá tài khoản?"
                description="Hành động này không thể hoàn tác."
                okText="Xoá"
                okButtonProps={{ danger: true }}
                cancelText="Huỷ"
                disabled={isLocked}
                onConfirm={() => handleDelete(record)}
              >
                <Button danger type="link" size="small" disabled={isLocked} icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      title="Danh sách người dùng"
      subTitle="Quản lý tài khoản, vai trò và trạng thái người dùng"
    >
      <ProTable<AdminUser>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          try {
            const verifiedParam =
              params.isVerified === "true" ? true :
              params.isVerified === "false" ? false : undefined;
            const result = await apiGetAdminUsers({
              page: params.current,
              pageSize: params.pageSize,
              name: params.name as string | undefined,
              verified: verifiedParam,
            });
            return { data: result.data, success: true, total: result.total };
          } catch (err) {
            message.error(err instanceof Error ? err.message : "Không thể tải danh sách người dùng");
            return { data: [], success: false, total: 0 };
          }
        }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => setSelectedKeys(keys as string[]),
          preserveSelectedRowKeys: true,
        }}
        tableAlertRender={({ selectedRowKeys }) =>
          selectedRowKeys.length > 0 ? (
            <Space>
              <span>Đã chọn <Badge count={selectedRowKeys.length} style={{ backgroundColor: "#1677ff" }} /> người dùng</span>
            </Space>
          ) : false
        }
        tableAlertOptionRender={() =>
          selectedKeys.length > 0 ? (
            <Space>
              <Popconfirm
                title={`Xác minh ${selectedKeys.length} tài khoản đã chọn?`}
                description="Chỉ các tài khoản chưa xác thực mới được xử lý."
                okText="Xác minh tất cả"
                cancelText="Huỷ"
                onConfirm={handleBulkVerify}
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<SafetyCertificateOutlined />}
                  loading={bulkLoading}
                >
                  Xác minh hàng loạt
                </Button>
              </Popconfirm>
              <Button size="small" onClick={() => setSelectedKeys([])}>Bỏ chọn</Button>
            </Space>
          ) : null
        }
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

      {/* ── Create Modal ───────────────────────────────────────────────────────── */}
      <ModalForm
        title="Thêm người dùng"
        open={createOpen}
        onOpenChange={setCreateOpen}
        modalProps={{ destroyOnHidden: true }}
        onFinish={async (values) => {
          try {
            await apiCreateUser({
              name: values.name,
              email: values.email,
              password: values.password,
              roles: [values.role],
            });
            message.success("Đã tạo tài khoản thành công!");
            actionRef.current?.reload();
            return true;
          } catch (err) {
            message.error(err instanceof Error ? err.message : "Tạo tài khoản thất bại");
            return false;
          }
        }}
      >
        <ProFormText
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        />
        <ProFormText
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 8, message: "Tối thiểu 8 ký tự" },
          ]}
        />
        <ProFormSelect
          name="role"
          label="Vai trò"
          options={ROLE_OPTIONS}
          initialValue="ROLE_USER"
          rules={[{ required: true }]}
        />
      </ModalForm>

      {/* ── Edit Drawer ────────────────────────────────────────────────────────── */}
      <Drawer
        title={`Chỉnh sửa: ${editUser?.name ?? ""}`}
        placement="right"
        width={440}
        open={!!editUser}
        onClose={() => setEditUser(null)}
        destroyOnHidden
        footer={
          <Space style={{ justifyContent: "flex-end", display: "flex" }}>
            <Button onClick={() => setEditUser(null)}>Huỷ</Button>
            <Button type="primary" loading={editLoading} onClick={handleEditSave}>
              Lưu thay đổi
            </Button>
          </Space>
        }
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="roles" label="Vai trò" rules={[{ required: true, message: "Chọn ít nhất một vai trò" }]}>
            <Select mode="multiple" options={ROLE_OPTIONS} />
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  );
}
