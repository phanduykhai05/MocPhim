"use client";

import React, { useRef, useState } from "react";
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Taxonomy = {
  id: number;
  name: string;
  slug: string;
  type: "genre" | "country" | "tag" | "studio" | "year";
  itemCount: number;
  isActive: boolean;
  description: string;
  updatedAt: string;
};

const taxonomyTypeMap: Record<Taxonomy["type"], string> = {
  genre: "Thể loại",
  country: "Quốc gia",
  tag: "Tag",
  studio: "Studio",
  year: "Năm phát hành",
};

const mockTaxonomies: Taxonomy[] = [
  { id: 1, name: "Hành động", slug: "hanh-dong", type: "genre", itemCount: 248, isActive: true, description: "Danh mục phim hành động", updatedAt: "06/05/2026" },
  { id: 2, name: "Hàn Quốc", slug: "han-quoc", type: "country", itemCount: 141, isActive: true, description: "Phim đến từ Hàn Quốc", updatedAt: "05/05/2026" },
  { id: 3, name: "Top trending", slug: "top-trending", type: "tag", itemCount: 42, isActive: true, description: "Nhãn gắn phim thịnh hành", updatedAt: "05/05/2026" },
  { id: 4, name: "Netflix", slug: "netflix", type: "studio", itemCount: 33, isActive: false, description: "Nguồn studio Netflix", updatedAt: "04/05/2026" },
  { id: 5, name: "2026", slug: "2026", type: "year", itemCount: 120, isActive: true, description: "Phim phát hành năm 2026", updatedAt: "03/05/2026" },
];

export default function DanhMucPage() {
  const actionRef = useRef<ActionType>();
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
        genre: { text: "Thể loại" },
        country: { text: "Quốc gia" },
        tag: { text: "Tag" },
        studio: { text: "Studio" },
        year: { text: "Năm" },
      },
      render: (_, record) => <Tag color="blue">{taxonomyTypeMap[record.type]}</Tag>,
    },
    {
      title: "Số phim",
      dataIndex: "itemCount",
      search: false,
      sorter: (a, b) => a.itemCount - b.itemCount,
      render: (v) => <Tag color="green">{v}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      valueType: "select",
      valueEnum: {
        true: { text: "Bật" },
        false: { text: "Tắt" },
      },
      render: (_, record) => (
        <Tag color={record.isActive ? "success" : "default"}>{record.isActive ? "Đang dùng" : "Đã tắt"}</Tag>
      ),
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      search: false,
      width: 120,
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info(`Sửa danh mục: ${record.name}`)} />
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
    <PageContainer title="Quản lý danh mục" subTitle="Category / Taxonomy cho phim">
      <ProTable<Taxonomy>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          let data = [...mockTaxonomies];
          if (params.name) {
            data = data.filter((item) => item.name.toLowerCase().includes(String(params.name).toLowerCase()));
          }
          if (params.type) {
            data = data.filter((item) => item.type === params.type);
          }
          return { data, success: true, total: data.length };
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Thêm danh mục
          </Button>,
        ]}
        pagination={{ pageSize: 10 }}
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
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="Tên danh mục" rules={[{ required: true }]} />
        <ProFormText name="slug" label="Slug" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="Loại taxonomy"
          options={[
            { label: "Thể loại", value: "genre" },
            { label: "Quốc gia", value: "country" },
            { label: "Tag", value: "tag" },
            { label: "Studio", value: "studio" },
            { label: "Năm phát hành", value: "year" },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSwitch name="isActive" label="Kích hoạt" initialValue />
        <ProFormTextArea name="description" label="Mô tả" fieldProps={{ rows: 3 }} />
      </ModalForm>
    </PageContainer>
  );
}
