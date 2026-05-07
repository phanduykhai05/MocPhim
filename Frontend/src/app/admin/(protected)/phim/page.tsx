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
import { Button, Tag, Space, Popconfirm, Image, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Movie = {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: "active" | "pending" | "hidden";
  views: number;
  episodes: string;
  thumb: string;
  createdAt: string;
};

const mockMovies: Movie[] = [
  { id: 1, title: "Huyền Thoại Aang: Tiết Khí Sư Cuối Cùng", slug: "huyen-thoai-aang", category: "Hoạt Hình", status: "active", views: 12400, episodes: "Full", thumb: "https://rophims.vip/wp-content/uploads/2026/04/huyen-thoai-aang-tiet-khi-su-cuoi-cung-48635-thumb.jpg", createdAt: "20/04/2026" },
  { id: 2, title: "One Piece", slug: "one-piece", category: "Anime", status: "active", views: 98000, episodes: "Tập 1157", thumb: "https://rophims.vip/wp-content/uploads/2026/04/one-piece-39120-thumb-149.jpg", createdAt: "19/04/2026" },
  { id: 3, title: "Nguyệt Lân Ỷ Kỷ", slug: "nguyet-lan-y-ky", category: "Phim bộ", status: "pending", views: 7200, episodes: "Tập 29", thumb: "https://rophims.vip/wp-content/uploads/2026/04/nguyet-lan-y-ky-38622-thumb-196.jpg", createdAt: "19/04/2026" },
  { id: 4, title: "Trục Ngọc", slug: "truc-ngoc", category: "Phim bộ", status: "active", views: 5100, episodes: "Hoàn tất", thumb: "https://rophims.vip/wp-content/uploads/2026/03/truc-ngoc-23313-thumb-4.jpg", createdAt: "18/04/2026" },
  { id: 5, title: "MF GHOST (Phần 3)", slug: "mf-ghost-phan-3", category: "Anime", status: "active", views: 4100, episodes: "Tập 12", thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/mf-ghost-phan-3-9469-thumb.webp", createdAt: "18/04/2026" },
  { id: 6, title: "Bất hòa (Phần 2)", slug: "bat-hoa-phan-2", category: "Phim bộ", status: "hidden", views: 3200, episodes: "Tập 6", thumb: "https://eduk.com.mx/wp-content/uploads/2026/04/bat-hoa-phan-2-9472-thumb.webp", createdAt: "17/04/2026" },
];

const statusMap: Record<string, { text: string; color: string }> = {
  active: { text: "Hoạt động", color: "success" },
  pending: { text: "Chờ duyệt", color: "warning" },
  hidden: { text: "Ẩn", color: "default" },
};

export default function PhimPage() {
  const actionRef = useRef<ActionType>();
  const [createOpen, setCreateOpen] = useState(false);
  const { message } = App.useApp();

  const columns: ProColumns<Movie>[] = [
    {
      title: "Ảnh",
      dataIndex: "thumb",
      search: false,
      width: 70,
      render: (_, record) => (
        <Image
          src={record.thumb}
          width={44}
          height={62}
          style={{ objectFit: "cover", borderRadius: 4 }}
          alt={record.title}
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "title",
      ellipsis: true,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.title}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      valueType: "select",
      valueEnum: {
        "Phim bộ": { text: "Phim bộ" },
        "Phim lẻ": { text: "Phim lẻ" },
        Anime: { text: "Anime" },
        "Hoạt Hình": { text: "Hoạt Hình" },
      },
    },
    {
      title: "Tập",
      dataIndex: "episodes",
      search: false,
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      search: false,
      sorter: (a, b) => a.views - b.views,
      render: (v) => Number(v).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        active: { text: "Hoạt động", status: "Success" },
        pending: { text: "Chờ duyệt", status: "Warning" },
        hidden: { text: "Ẩn", status: "Default" },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status].color}>
          {statusMap[record.status].text}
        </Tag>
      ),
    },
    {
      title: "Ngày thêm",
      dataIndex: "createdAt",
      search: false,
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => message.info(`Sửa: ${record.title}`)}
          />
          <Popconfirm
            title="Xoá phim này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => message.success("Đã xoá")}
          >
            <Button danger type="link" size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý Phim">
      <ProTable<Movie>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          let data = [...mockMovies];
          if (params.title) {
            data = data.filter((m) =>
              m.title.toLowerCase().includes(params.title.toLowerCase())
            );
          }
          if (params.status) data = data.filter((m) => m.status === params.status);
          if (params.category) data = data.filter((m) => m.category === params.category);
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
            Thêm phim
          </Button>,
        ]}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        dateFormatter="string"
      />

      <ModalForm
        title="Thêm phim mới"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onFinish={async (values) => {
          console.log(values);
          message.success("Đã thêm phim thành công!");
          setCreateOpen(false);
          return true;
        }}
        modalProps={{ destroyOnHidden: true }}
      >
        <ProFormText name="title" label="Tên phim" rules={[{ required: true }]} />
        <ProFormText name="slug" label="Slug" rules={[{ required: true }]} />
        <ProFormSelect
          name="category"
          label="Thể loại"
          options={["Phim bộ", "Phim lẻ", "Anime", "Hoạt Hình"].map((c) => ({ label: c, value: c }))}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="Trạng thái"
          options={[
            { label: "Hoạt động", value: "active" },
            { label: "Chờ duyệt", value: "pending" },
            { label: "Ẩn", value: "hidden" },
          ]}
          initialValue="pending"
        />
        <ProFormText name="thumb" label="URL ảnh thumbnail" />
        <ProFormTextArea name="description" label="Mô tả" />
      </ModalForm>
    </PageContainer>
  );
}
