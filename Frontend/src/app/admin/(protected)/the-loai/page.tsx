"use client";

import React, { useRef, useState } from "react";
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Genre = {
  id: number;
  name: string;
  slug: string;
  description: string;
  movieCount: number;
  createdAt: string;
};

const mockGenres: Genre[] = [
  { id: 1, name: "Hành Động", slug: "hanh-dong", description: "Phim hành động kịch tính", movieCount: 248, createdAt: "01/01/2025" },
  { id: 2, name: "Tình Cảm", slug: "tinh-cam", description: "Phim tình cảm lãng mạn", movieCount: 182, createdAt: "01/01/2025" },
  { id: 3, name: "Hài Hước", slug: "hai-huoc", description: "Phim hài hước vui nhộn", movieCount: 134, createdAt: "01/01/2025" },
  { id: 4, name: "Kinh Dị", slug: "kinh-di", description: "Phim kinh dị rùng rợn", movieCount: 97, createdAt: "01/01/2025" },
  { id: 5, name: "Hoạt Hình", slug: "hoat-hinh", description: "Phim hoạt hình anime", movieCount: 215, createdAt: "01/01/2025" },
  { id: 6, name: "Khoa Học Viễn Tưởng", slug: "khoa-hoc-vien-tuong", description: "Phim viễn tưởng khoa học", movieCount: 76, createdAt: "02/01/2025" },
  { id: 7, name: "Tâm Lý", slug: "tam-ly", description: "Phim tâm lý sâu sắc", movieCount: 119, createdAt: "02/01/2025" },
  { id: 8, name: "Phiêu Lưu", slug: "phieu-luu", description: "Phim phiêu lưu mạo hiểm", movieCount: 88, createdAt: "02/01/2025" },
];

export default function TheLoaiPage() {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const { message } = App.useApp();

  const columns: ProColumns<Genre>[] = [
    {
      title: "STT",
      dataIndex: "id",
      width: 60,
      search: false,
      align: "center",
    },
    {
      title: "Tên thể loại",
      dataIndex: "name",
      render: (_, record) => <strong>{record.name}</strong>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      render: (_, record) => (
        <Tag color="blue" style={{ fontFamily: "monospace" }}>
          {record.slug}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      search: false,
      ellipsis: true,
    },
    {
      title: "Số phim",
      dataIndex: "movieCount",
      search: false,
      sorter: (a, b) => a.movieCount - b.movieCount,
      align: "right",
      render: (_, record) => <Tag color="green">{record.movieCount}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      search: false,
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      search: false,
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => message.info(`Sửa: ${record.name}`)}
          />
          <Popconfirm
            title="Xoá thể loại?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => message.success(`Đã xoá: ${record.name}`)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Thể loại" subTitle="Quản lý danh mục thể loại phim">
      <ProTable<Genre>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        dataSource={mockGenres}
        request={async () => ({ data: mockGenres, success: true })}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Thêm thể loại
          </Button>,
        ]}
        search={{ labelWidth: "auto" }}
        pagination={{ pageSize: 10 }}
      />

      <ModalForm
        title="Thêm thể loại mới"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onFinish={async (values) => {
          message.success(`Đã thêm thể loại: ${values.name}`);
          setCreateOpen(false);
          return true;
        }}
        modalProps={{ destroyOnHidden: true }}
      >
        <ProFormText
          name="name"
          label="Tên thể loại"
          placeholder="Nhập tên thể loại"
          rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}
        />
        <ProFormText
          name="slug"
          label="Slug"
          placeholder="vd: hanh-dong"
          rules={[{ required: true, message: "Vui lòng nhập slug" }]}
        />
        <ProFormTextArea
          name="description"
          label="Mô tả"
          placeholder="Mô tả ngắn về thể loại"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>
    </PageContainer>
  );
}
