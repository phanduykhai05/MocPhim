"use client";

import React, { useRef } from "react";
import {
  PageContainer,
  ProTable,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Image } from "antd";
import { EditOutlined, ExportOutlined } from "@ant-design/icons";
import { fetchSyncMovies, type MovieSyncItem } from "@/lib/api/sync";
import { getMovieThumb } from "@/lib/api/movie";

const TYPE_LABEL: Record<string, { text: string; color: string }> = {
  series:   { text: "Phim bộ",   color: "blue" },
  single:   { text: "Phim lẻ",   color: "green" },
  hoathinh: { text: "Hoạt hình", color: "orange" },
  tvshows:  { text: "TV Shows",  color: "purple" },
};

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  } catch { return iso; }
}

export default function PhimPage() {
  const actionRef = useRef<ActionType | undefined>(undefined);

  const columns: ProColumns<MovieSyncItem>[] = [
    {
      title: "Ảnh",
      dataIndex: "thumbUrl",
      search: false,
      width: 60,
      render: (_, record) =>
        record.thumbUrl ? (
          <Image
            src={record.thumbUrl.startsWith("http") ? record.thumbUrl : getMovieThumb(record.thumbUrl)}
            width={40}
            height={56}
            style={{ objectFit: "cover", borderRadius: 4 }}
            alt={record.title}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : null,
    },
    {
      title: "Tên phim",
      dataIndex: "title",
      ellipsis: true,
      render: (_, record) => (
        <div>
          <a href={`/phim/${record.slug}`} target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>
            {record.title}
          </a>
          {record.originName && (
            <div style={{ fontSize: 11, color: "#8c8c8c" }}>{record.originName}</div>
          )}
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      width: 110,
      valueType: "select",
      valueEnum: Object.fromEntries(
        Object.entries(TYPE_LABEL).map(([k, v]) => [k, { text: v.text }])
      ),
      render: (_, record) => {
        const t = TYPE_LABEL[record.type ?? ""] ?? { text: record.type ?? "-", color: "default" };
        return <Tag color={t.color}>{t.text}</Tag>;
      },
    },
    {
      title: "Tập hiện tại",
      dataIndex: "episodeCurrent",
      search: false,
      width: 120,
    },
    {
      title: "Chất lượng",
      dataIndex: "quality",
      search: false,
      width: 90,
      render: (v) => v ? <Tag color="cyan">{String(v)}</Tag> : "-",
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "lang",
      search: false,
      width: 90,
      render: (v) => v ? <Tag color="geekblue">{String(v)}</Tag> : "-",
    },
    {
      title: "Năm",
      dataIndex: "year",
      search: false,
      width: 65,
    },
    {
      title: "Cập nhật",
      dataIndex: "modifiedAt",
      search: false,
      width: 135,
      render: (v) => formatDateTime(String(v)),
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 90,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<ExportOutlined />}
            href={`/phim/${record.slug}`}
            target="_blank"
          />
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {}}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý Phim" subTitle="Danh sách phim đã sync từ nguồn">
      <ProTable<MovieSyncItem>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const page = (params.current ?? 1) - 1;
          const size = params.pageSize ?? 20;
          const res = await fetchSyncMovies(page, size);
          if (!res) return { data: [], success: false, total: 0 };
          let data = res.items;
          if (params.title) {
            const q = String(params.title).toLowerCase();
            data = data.filter((m) =>
              m.title.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q)
            );
          }
          if (params.type) {
            data = data.filter((m) => m.type === params.type);
          }
          return { data, success: true, total: res.pagination.totalItems };
        }}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        scroll={{ x: 1000 }}
        rowSelection={{}}
        dateFormatter="string"
      />
    </PageContainer>
  );
}
