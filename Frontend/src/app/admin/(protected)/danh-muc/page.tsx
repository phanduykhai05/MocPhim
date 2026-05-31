"use client";

import React, { useRef, useState } from "react";
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchCategories, fetchCountries } from "@/lib/api/movie";

type Taxonomy = {
  id: string;
  name: string;
  slug: string;
  type: "genre" | "country";
};

export default function DanhMucPage() {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const { message } = App.useApp();

  const columns: ProColumns<Taxonomy>[] = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      valueType: "select",
      valueEnum: {
        genre:   { text: "Thể loại" },
        country: { text: "Quốc gia" },
      },
      render: (_, record) => (
        <Tag color={record.type === "genre" ? "blue" : "green"}>
          {record.type === "genre" ? "Thể loại" : "Quốc gia"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info(`Sửa: ${record.name}`)} />
          <Popconfirm
            title="Xóa danh mục này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => message.success(`Đã xóa: ${record.name}`)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý danh mục" subTitle="Thể loại & Quốc gia">
      <ProTable<Taxonomy>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const [categories, countries] = await Promise.all([
            fetchCategories(),
            fetchCountries(),
          ]);
          let data: Taxonomy[] = [
            ...categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, type: "genre" as const })),
            ...countries.map((c)  => ({ id: c.id, name: c.name, slug: c.slug, type: "country" as const })),
          ];
          if (params.name) {
            const q = String(params.name).toLowerCase();
            data = data.filter((d) => d.name.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q));
          }
          if (params.type) {
            data = data.filter((d) => d.type === params.type);
          }
          return { data, success: true, total: data.length };
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Thêm danh mục
          </Button>,
        ]}
        pagination={{ pageSize: 20 }}
      />

      <ModalForm
        title="Tạo danh mục mới"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onFinish={async (values) => {
          console.log(values);
          message.success("Đã tạo danh mục mới");
          return true;
        }}
        modalProps={{ destroyOnHidden: true }}
      >
        <ProFormText name="name" label="Tên danh mục" rules={[{ required: true }]} />
        <ProFormText name="slug" label="Slug" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="Loại"
          options={[
            { label: "Thể loại", value: "genre" },
            { label: "Quốc gia", value: "country" },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormTextArea name="description" label="Mô tả" fieldProps={{ rows: 3 }} />
      </ModalForm>
    </PageContainer>
  );
}
