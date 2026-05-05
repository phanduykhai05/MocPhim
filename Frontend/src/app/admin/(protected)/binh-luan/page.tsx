"use client";

import React, { useRef } from "react";
import {
  PageContainer,
  ProTable,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, Avatar, App, Typography } from "antd";
import { DeleteOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Comment = {
  id: number;
  user: string;
  avatar: string;
  movie: string;
  movieSlug: string;
  content: string;
  status: "approved" | "pending" | "spam";
  createdAt: string;
};

const mockComments: Comment[] = [
  { id: 1, user: "Nguyễn Văn A", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1", movie: "One Piece", movieSlug: "one-piece", content: "Phim hay quá, xem mãi không chán!", status: "approved", createdAt: "05/05/2026 09:12" },
  { id: 2, user: "Trần Thị B", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2", movie: "Huyền Thoại Aang", movieSlug: "huyen-thoai-aang", content: "Nhân vật Aang trong bản này rất đáng yêu, cốt truyện bám sát nguyên tác.", status: "approved", createdAt: "05/05/2026 08:44" },
  { id: 3, user: "Lê Văn C", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3", movie: "MF GHOST (Phần 3)", movieSlug: "mf-ghost-phan-3", content: "Phụ đề bị lỗi ở tập 10, mong admin fix sớm.", status: "pending", createdAt: "04/05/2026 22:30" },
  { id: 4, user: "Phạm Thị D", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4", movie: "Nguyệt Lân Ỷ Kỷ", movieSlug: "nguyet-lan-y-ky", content: "Mua acc vip giá rẻ liên hệ zalo 0123456789", status: "spam", createdAt: "04/05/2026 18:05" },
  { id: 5, user: "Hoàng Văn E", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=5", movie: "Trục Ngọc", movieSlug: "truc-ngoc", content: "Diễn xuất của dàn diễn viên xuất sắc, đặc biệt là cảnh kết phim.", status: "approved", createdAt: "04/05/2026 14:22" },
  { id: 6, user: "Đỗ Thị F", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=6", movie: "Bất hòa (Phần 2)", movieSlug: "bat-hoa-phan-2", content: "Phần này có vẻ không hay bằng phần 1 nhỉ?", status: "pending", createdAt: "03/05/2026 20:18" },
  { id: 7, user: "Vũ Văn G", avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=7", movie: "One Piece", movieSlug: "one-piece", content: "Click vào link này để nhận gift code: bit.ly/abc123", status: "spam", createdAt: "03/05/2026 16:00" },
];

const statusMap: Record<string, { text: string; color: string }> = {
  approved: { text: "Đã duyệt", color: "success" },
  pending: { text: "Chờ duyệt", color: "warning" },
  spam: { text: "Spam", color: "error" },
};

export default function BinhLuanPage() {
  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();

  const columns: ProColumns<Comment>[] = [
    {
      title: "Người dùng",
      dataIndex: "user",
      width: 160,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} size="small" />
          <Text>{record.user}</Text>
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
              {record.movie}
            </a>
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
        pending: { text: "Chờ duyệt" },
        spam: { text: "Spam" },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status].color}>
          {statusMap[record.status].text}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      search: false,
      width: 150,
    },
    {
      title: "Thao tác",
      key: "action",
      search: false,
      width: 110,
      render: (_, record) => (
        <Space>
          {record.status !== "approved" && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              size="small"
              style={{ color: "#52c41a" }}
              onClick={() => message.success(`Đã duyệt bình luận của ${record.user}`)}
            />
          )}
          {record.status !== "spam" && (
            <Button
              type="link"
              icon={<StopOutlined />}
              size="small"
              style={{ color: "#faad14" }}
              onClick={() => message.warning(`Đã đánh dấu spam`)}
            />
          )}
          <Popconfirm
            title="Xoá bình luận?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => message.success("Đã xoá bình luận")}
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
      <ProTable<Comment>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        dataSource={mockComments}
        request={async () => ({ data: mockComments, success: true })}
        search={{ labelWidth: "auto" }}
        pagination={{ pageSize: 10 }}
        toolBarRender={false}
      />
    </PageContainer>
  );
}
