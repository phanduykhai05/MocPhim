"use client";

import { useRef } from "react";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, Avatar, App, Typography } from "antd";
import { DeleteOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import {
  apiAdminGetComments, apiAdminUpdateCommentStatus, apiDeleteComment,
  type CommentItem,
} from "@/lib/api/comments";

const { Text } = Typography;

const statusMap: Record<string, { text: string; color: string }> = {
  approved: { text: "Đã duyệt", color: "success" },
  pending:  { text: "Chờ duyệt", color: "warning" },
  spam:     { text: "Spam",      color: "error" },
};

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }); }
  catch { return iso; }
}

export default function BinhLuanPage() {
  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();

  async function approve(record: CommentItem) {
    const ok = await apiAdminUpdateCommentStatus(record.id, "approved");
    if (ok) { message.success("Đã duyệt bình luận"); actionRef.current?.reload(); }
    else message.error("Có lỗi xảy ra");
  }

  async function markSpam(record: CommentItem) {
    const ok = await apiAdminUpdateCommentStatus(record.id, "spam");
    if (ok) { message.warning("Đã đánh dấu spam"); actionRef.current?.reload(); }
    else message.error("Có lỗi xảy ra");
  }

  async function remove(record: CommentItem) {
    const ok = await apiDeleteComment(record.id);
    if (ok) { message.success("Đã xoá bình luận"); actionRef.current?.reload(); }
    else message.error("Có lỗi xảy ra");
  }

  const columns: ProColumns<CommentItem>[] = [
    {
      title: "Người dùng",
      dataIndex: "userName",
      width: 160,
      render: (_, r) => (
        <Space>
          <Avatar src={r.userAvatar ?? `https://api.dicebear.com/7.x/miniavs/svg?seed=${r.userId}`} size="small" />
          <Text>{r.userName}</Text>
        </Space>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "content",
      ellipsis: true,
      render: (_, r) => (
        <div>
          <Text>{r.isSpoiler ? <em style={{ color: "#faad14" }}>[Spoiler] </em> : null}{r.content}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Phim: <a href={`/phim/${r.movieSlug}`} target="_blank" rel="noreferrer">{r.movieSlug}</a>
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
      render: (_, r) => (
        <Tag color={statusMap[r.status]?.color}>{statusMap[r.status]?.text ?? r.status}</Tag>
      ),
    },
    {
      title: "Vote",
      search: false,
      width: 80,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>▲{r.upvotes} ▼{r.downvotes}</Text>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      search: false,
      width: 150,
      render: (_, r) => formatDate(r.createdAt),
    },
    {
      title: "Thao tác",
      key: "action",
      search: false,
      width: 110,
      render: (_, r) => (
        <Space>
          {r.status !== "approved" && (
            <Button type="link" icon={<CheckCircleOutlined />} size="small"
              style={{ color: "#52c41a" }} onClick={() => approve(r)} title="Duyệt" />
          )}
          {r.status !== "spam" && (
            <Button type="link" icon={<StopOutlined />} size="small"
              style={{ color: "#faad14" }} onClick={() => markSpam(r)} title="Spam" />
          )}
          <Popconfirm title="Xoá bình luận?" description="Không thể hoàn tác."
            onConfirm={() => remove(r)} okText="Xoá" cancelText="Huỷ" okButtonProps={{ danger: true }}>
            <Button type="link" icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Bình luận" subTitle="Quản lý bình luận người dùng">
      <ProTable<CommentItem>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const page = (params.current ?? 1) - 1;
          const size = params.pageSize ?? 20;
          const { data, total } = await apiAdminGetComments(page, size, params.status);
          return { data, success: true, total };
        }}
        search={{ labelWidth: "auto" }}
        pagination={{ pageSize: 20, showTotal: (t) => `Tổng ${t} bình luận` }}
        toolBarRender={false}
      />
    </PageContainer>
  );
}
