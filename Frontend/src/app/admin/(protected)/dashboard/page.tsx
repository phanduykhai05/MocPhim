"use client";

import React from "react";
import { PageContainer, ProCard, StatisticCard } from "@ant-design/pro-components";
import {
  VideoCameraOutlined,
  UserOutlined,
  EyeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Table, Tag, Avatar, Progress } from "antd";


const recentMovies = [
  { key: 1, title: "Huyền Thoại Aang", category: "Hoạt Hình", status: "active", views: 12400, date: "20/04/2026" },
  { key: 2, title: "One Piece Tập 1157", category: "Anime", status: "active", views: 9800, date: "20/04/2026" },
  { key: 3, title: "Nguyệt Lân Ỷ Kỷ", category: "Phim bộ", status: "pending", views: 7200, date: "19/04/2026" },
  { key: 4, title: "Bất hòa (Phần 2)", category: "Phim bộ", status: "active", views: 5400, date: "19/04/2026" },
  { key: 5, title: "MF Ghost (Phần 3)", category: "Anime", status: "active", views: 4100, date: "18/04/2026" },
];

const recentColumns = [
  {
    title: "Phim",
    dataIndex: "title",
    render: (text: string) => (
      <span style={{ fontWeight: 500 }}>{text}</span>
    ),
  },
  { title: "Thể loại", dataIndex: "category" },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (s: string) =>
      s === "active" ? (
        <Tag color="success">Hoạt động</Tag>
      ) : (
        <Tag color="warning">Chờ duyệt</Tag>
      ),
  },
  {
    title: "Lượt xem",
    dataIndex: "views",
    render: (v: number) => v.toLocaleString("vi-VN"),
  },
  { title: "Ngày thêm", dataIndex: "date" },
];

const topUsers = [
  { name: "Nguyễn Văn A", email: "a@mocphim.vn", comments: 142, avatar: "A" },
  { name: "Trần Thị B", email: "b@mocphim.vn", comments: 98, avatar: "B" },
  { name: "Lê Văn C", email: "c@mocphim.vn", comments: 76, avatar: "C" },
  { name: "Phạm Thị D", email: "d@mocphim.vn", comments: 54, avatar: "D" },
];

export default function DashboardPage() {
  return (
    <PageContainer
      title="Tổng quan"
      subTitle="Chào mừng trở lại, Admin!"
    >
      {/* Stat cards */}
      <ProCard ghost gutter={[16, 16]} wrap>
        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard
            statistic={{
              title: "Tổng phim",
              value: 1248,
              icon: (
                <VideoCameraOutlined
                  style={{ color: "#1677ff", fontSize: 24, background: "#e6f4ff", borderRadius: 8, padding: 8 }}
                />
              ),
              description: (
                <StatisticCard.Statistic
                  title="So với tháng trước"
                  value={8.2}
                  suffix="%"
                  trend="up"
                />
              ),
            }}
          />
        </ProCard>

        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard
            statistic={{
              title: "Người dùng",
              value: 32540,
              icon: (
                <UserOutlined
                  style={{ color: "#52c41a", fontSize: 24, background: "#f6ffed", borderRadius: 8, padding: 8 }}
                />
              ),
              description: (
                <StatisticCard.Statistic
                  title="So với tháng trước"
                  value={12.5}
                  suffix="%"
                  trend="up"
                />
              ),
            }}
          />
        </ProCard>

        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard
            statistic={{
              title: "Lượt xem hôm nay",
              value: 84290,
              icon: (
                <EyeOutlined
                  style={{ color: "#faad14", fontSize: 24, background: "#fffbe6", borderRadius: 8, padding: 8 }}
                />
              ),
              description: (
                <StatisticCard.Statistic
                  title="So với hôm qua"
                  value={3.1}
                  suffix="%"
                  trend="down"
                />
              ),
            }}
          />
        </ProCard>

        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard
            statistic={{
              title: "Bình luận mới",
              value: 426,
              icon: (
                <CommentOutlined
                  style={{ color: "#722ed1", fontSize: 24, background: "#f9f0ff", borderRadius: 8, padding: 8 }}
                />
              ),
              description: (
                <StatisticCard.Statistic
                  title="So với hôm qua"
                  value={5.8}
                  suffix="%"
                  trend="up"
                />
              ),
            }}
          />
        </ProCard>
      </ProCard>

      {/* Main content */}
      <ProCard ghost gutter={[16, 16]} wrap style={{ marginTop: 16 }}>
        {/* Recent movies table */}
        <ProCard
          colSpan={{ xs: 24, lg: 16 }}
          title="Phim mới cập nhật"
          bordered
          extra={<a href="/admin/phim">Xem tất cả</a>}
        >
          <Table
            dataSource={recentMovies}
            columns={recentColumns}
            pagination={false}
            size="small"
          />
        </ProCard>

        {/* Right column */}
        <ProCard colSpan={{ xs: 24, lg: 8 }} ghost gutter={[16, 16]} direction="column">
          {/* Category distribution */}
          <ProCard title="Phân bố thể loại" bordered>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Phim bộ", value: 42, color: "#1677ff" },
                { label: "Phim lẻ", value: 35, color: "#52c41a" },
                { label: "Anime", value: 23, color: "#faad14" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Progress
                    type="circle"
                    percent={item.value}
                    size={44}
                    strokeColor={item.color}
                    strokeWidth={8}
                    format={(p) => `${p}%`}
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>{item.value}% tổng phim</div>
                  </div>
                </div>
              ))}
            </div>
          </ProCard>

          {/* Top active users */}
          <ProCard title="Người dùng tích cực" bordered>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {topUsers.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar style={{ backgroundColor: "#1677ff", flexShrink: 0 }}>
                    {u.avatar}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#8c8c8c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.email}
                    </div>
                  </div>
                  <Tag color="blue">{u.comments} CM</Tag>
                </div>
              ))}
            </div>
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
