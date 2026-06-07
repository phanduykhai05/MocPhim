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
import { fetchCategories } from "@/lib/api/movie";

type Genre = {
  id: string;
  name: string;
  slug: string;
};

export default function TheLoaiPage() {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const { message } = App.useApp();

  const columns: ProColumns<Genre>[] = [
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
      title: "Link xem phim",
      dataIndex: "slug",
      search: false,
      render: (_, record) => (
        <a href={`/the-loai/${record.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
          /the-loai/{record.slug}
        </a>
      ),
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
        request={async (params) => {
          const categories = await fetchCategories();
          let data: Genre[] = categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
          if (params.name) {
            const q = String(params.name).toLowerCase();
            data = data.filter((d) => d.name.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q));
          }
          return { data, success: true, total: data.length };
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Thêm thể loại
          </Button>,
        ]}
        search={{ labelWidth: "auto" }}
        pagination={{ pageSize: 20 }}
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
        <ProFormText name="name" label="Tên thể loại" placeholder="Nhập tên thể loại" rules={[{ required: true }]} />
        <ProFormText name="slug" label="Slug" placeholder="vd: hanh-dong" rules={[{ required: true }]} />
        <ProFormTextArea name="description" label="Mô tả" fieldProps={{ rows: 3 }} />
      </ModalForm>
    </PageContainer>
  );
}
