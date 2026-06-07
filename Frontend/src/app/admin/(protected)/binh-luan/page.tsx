"use client";

import React, { useRef } from "react";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, Avatar, App, Typography, Tooltip } from "antd";
import { DeleteOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import {
  apiAdminGetComments,
  apiAdminUpdateCommentStatus,
  apiDeleteComment,
  type AdminCommentItem,
} from "@/lib/api/comments";

const { Text } = Typography;

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

const statusMap: Record<string, { text: string; color: string }> = {
  approved: { text: "Đã duyệt", color: "success" },
  pending:  { text: "Chờ duyệt", color: "warning" },
  spam:     { text: "Spam",      color: "error" },
};

export default function BinhLuanPage() {
  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();

  async function handleApprove(id: number) {
    const ok = await apiAdminUpdateCommentStatus(id, "approved");
    if (ok) {
      message.success("Đã duyệt bình luận");
      actionRef.current?.reload();
    } else {
      message.error("Không thể duyệt bình luận");
    }
  }

  async function handleSpam(id: number) {
    const ok = await apiAdminUpdateCommentStatus(id, "spam");
    if (ok) {
      message.warning("Đã đánh dấu spam");
      actionRef.current?.reload();
    } else {
      message.error("Không thể cập nhật trạng thái");
    }
  }

  async function handleDelete(id: number) {
    const ok = await apiDeleteComment(id);
    if (ok) {
      message.success("Đã xoá bình luận");
      actionRef.current?.reload();
    } else {
      message.error("Không thể xoá bình luận");
    }
  }

  const columns: ProColumns<AdminCommentItem>[] = [
    {
      title: "Người dùng",
      dataIndex: "userName",
      width: 160,
      search: false,
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.userAvatar ?? undefined}
            size="small"
            style={{ backgroundColor: "#1677ff", flexShrink: 0 }}
          >
            {!record.userAvatar && record.userName?.[0]?.toUpperCase()}
          </Avatar>
          <Text>{record.userName}</Text>
        </Space>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "content",
      ellipsis: true,
      render: (_, record) => (
        <div>
          <Text>{record.content}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Phim:{" "}
            <a href={`/phim/${record.movieSlug}`} target="_blank" rel="noreferrer">
              {record.movieSlug}
            </a>
            {record.parentId && (
              <Tag style={{ marginLeft: 6 }} color="blue">Reply</Tag>
            )}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      valueEnum: {
        approved: { text: "Đã duyệt" },
        pending:  { text: "Chờ duyệt" },
        spam:     { text: "Spam" },
      },
      render: (_, record) => {
        const s = statusMap[record.status] ?? { text: record.status, color: "default" };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      search: false,
      width: 150,
      render: (v) => formatDateTime(v as string),
    },
    {
      title: "Thao tác",
      key: "action",
      search: false,
      width: 120,
      render: (_, record) => (
        <Space>
          {record.status !== "approved" && (
            <Tooltip title="Duyệt">
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                size="small"
                style={{ color: "#52c41a" }}
                onClick={() => handleApprove(record.id)}
              />
            </Tooltip>
          )}
          {record.status !== "spam" && (
            <Tooltip title="Đánh dấu spam">
              <Button
                type="link"
                icon={<StopOutlined />}
                size="small"
                style={{ color: "#faad14" }}
                onClick={() => handleSpam(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Xoá bình luận?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
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
    <PageContainer title="Bình luận" subTitle="Quản lý bình luận người dùng">
      <ProTable<AdminCommentItem>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { current = 1, pageSize = 20, status } = params as {
            current?: number;
            pageSize?: number;
            status?: string;
          };
          const res = await apiAdminGetComments(current - 1, pageSize, status);
          return { data: res.comments, success: true, total: res.total };
        }}
        search={{ labelWidth: "auto" }}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        toolBarRender={false}
      />
    </PageContainer>
  );
}
