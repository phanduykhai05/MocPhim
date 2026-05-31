"use client";

import React, { useEffect, useState } from "react";
import { PageContainer, ProCard, StatisticCard } from "@ant-design/pro-components";
import {
  VideoCameraOutlined,
  UserOutlined,
  EyeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Table, Tag, Avatar, Progress, Spin } from "antd";
import { fetchSyncMovies, fetchSyncMoviesAll, fetchSyncCount, type MovieSyncItem } from "@/lib/api/sync";
import { apiGetAdminUsers, type AdminUser } from "@/lib/api/admin";

const TYPE_LABEL: Record<string, string> = {
  single: "Phim lẻ",
  series: "Phim bộ",
  tvshows: "TV Shows",
  hoathinh: "Hoạt hình",
};

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  } catch { return iso; }
}

const recentColumns = [
  {
    title: "Tên phim",
    dataIndex: "title",
    ellipsis: true,
    render: (text: string, row: MovieSyncItem) => (
      <a href={`/phim/${row.slug}`} target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>
        {text}
        {row.originName && <div style={{ fontSize: 11, color: "#8c8c8c", fontWeight: 400 }}>{row.originName}</div>}
      </a>
    ),
  },
  {
    title: "Loại",
    dataIndex: "type",
    width: 100,
    render: (t: string) => <Tag color="blue">{TYPE_LABEL[t] ?? t}</Tag>,
  },
  {
    title: "Tập hiện tại",
    dataIndex: "episodeCurrent",
    width: 130,
  },
  {
    title: "Chất lượng",
    dataIndex: "quality",
    width: 90,
  },
  {
    title: "Ngôn ngữ",
    dataIndex: "lang",
    width: 90,
    render: (lang: string) => <Tag color="purple">{lang}</Tag>,
  },
  {
    title: "Năm",
    dataIndex: "year",
    width: 65,
  },
  {
    title: "Cập nhật",
    dataIndex: "modifiedAt",
    width: 140,
    render: (v: string) => formatDateTime(v),
  },
];

const ROLE_LABEL: Record<string, string> = {
  ROLE_ADMIN: "Admin",
  ROLE_USER: "Thành viên",
};
const ROLE_COLOR: Record<string, string> = {
  ROLE_ADMIN: "gold",
  ROLE_USER: "blue",
};

function calcMonthGrowth(dates: string[]): { value: number; trend: "up" | "down" } | null {
  const now = new Date();
  const curY = now.getFullYear(), curM = now.getMonth();
  const prevY = curM === 0 ? curY - 1 : curY, prevM = curM === 0 ? 11 : curM - 1;
  let cur = 0, prev = 0;
  for (const d of dates) {
    const dt = new Date(d);
    if (dt.getFullYear() === curY  && dt.getMonth() === curM)  cur++;
    if (dt.getFullYear() === prevY && dt.getMonth() === prevM) prev++;
  }
  if (prev === 0) return cur > 0 ? { value: 100, trend: "up" } : null;
  const pct = Math.round(((cur - prev) / prev) * 1000) / 10;
  return { value: Math.abs(pct), trend: pct >= 0 ? "up" : "down" };
}

export default function DashboardPage() {
  const [recentMovies, setRecentMovies] = useState<MovieSyncItem[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  type DistItem = { label: string; count: number; percent: number; color: string };
  const [distribution, setDistribution] = useState<DistItem[]>([]);
  const [distLoading, setDistLoading] = useState(true);

  const [totalMovies, setTotalMovies] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [movieGrowth, setMovieGrowth] = useState<{ value: number; trend: "up" | "down" } | null>(null);
  const [userGrowth, setUserGrowth]   = useState<{ value: number; trend: "up" | "down" } | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetchSyncCount().then((n) => setTotalMovies(n));
  }, []);

  useEffect(() => {
    // Fetch enough users to calculate monthly growth
    apiGetAdminUsers({ page: 1, pageSize: 500 })
      .then((res) => {
        setUsers(res.data.slice(0, 6));
        setTotalUsers(res.total);
        const growth = calcMonthGrowth(res.data.map((u) => u.createdAt));
        if (growth !== null) setUserGrowth(growth);
      })
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    fetchSyncMovies(0, 10)
      .then((res) => setRecentMovies(res?.items ?? []))
      .finally(() => setMoviesLoading(false));
  }, []);

  useEffect(() => {
    const TYPE_MAP: Record<string, { label: string; color: string }> = {
      series:   { label: "Phim bộ",   color: "#1677ff" },
      single:   { label: "Phim lẻ",   color: "#52c41a" },
      hoathinh: { label: "Hoạt hình", color: "#faad14" },
      tvshows:  { label: "TV Shows",  color: "#f5222d" },
    };
    fetchSyncMoviesAll()
      .then((all) => {
        if (!all) return;
        const growth = calcMonthGrowth(all.map((m) => m.createdAt));
        if (growth) setMovieGrowth(growth);
        const counts: Record<string, number> = {};
        for (const m of all) {
          const t = m.type ?? "other";
          counts[t] = (counts[t] ?? 0) + 1;
        }
        const total = all.length || 1;
        setDistribution(
          Object.entries(TYPE_MAP)
            .map(([type, meta]) => ({
              label: meta.label,
              color: meta.color,
              count: counts[type] ?? 0,
              percent: Math.round(((counts[type] ?? 0) / total) * 100),
            }))
            .filter((d) => d.count > 0)
        );
      })
      .finally(() => setDistLoading(false));
  }, []);

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
              value: totalMovies ?? "-",
              icon: (
                <VideoCameraOutlined
                  style={{ color: "#1677ff", fontSize: 24, background: "#e6f4ff", borderRadius: 8, padding: 8 }}
                />
              ),
              description: movieGrowth ? (
                <StatisticCard.Statistic
                  title="So với tháng trước"
                  value={movieGrowth.value}
                  suffix="%"
                  trend={movieGrowth.trend}
                />
              ) : undefined,
            }}
          />
        </ProCard>

        <ProCard colSpan={{ xs: 24, sm: 12, md: 6 }} bordered>
          <StatisticCard
            statistic={{
              title: "Người dùng",
              value: totalUsers ?? "-",
              icon: (
                <UserOutlined
                  style={{ color: "#52c41a", fontSize: 24, background: "#f6ffed", borderRadius: 8, padding: 8 }}
                />
              ),
              description: userGrowth ? (
                <StatisticCard.Statistic
                  title="So với tháng trước"
                  value={userGrowth.value}
                  suffix="%"
                  trend={userGrowth.trend}
                />
              ) : undefined,
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
              value: 0,
              icon: (
                <CommentOutlined
                  style={{ color: "#722ed1", fontSize: 24, background: "#f9f0ff", borderRadius: 8, padding: 8 }}
                />
              ),
              description: (
                <StatisticCard.Statistic
                  title="So với hôm qua"
                  value={0}
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
          <Spin spinning={moviesLoading}>
            <Table
              dataSource={recentMovies}
              rowKey="id"
              columns={recentColumns}
              pagination={false}
              size="small"
            />
          </Spin>
        </ProCard>

        {/* Right column */}
        <ProCard colSpan={{ xs: 24, lg: 8 }} ghost gutter={[16, 16]} direction="column">
          {/* Category distribution */}
          <ProCard title="Phân bố thể loại" bordered>
            <Spin spinning={distLoading}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {distribution.map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Progress
                      type="circle"
                      percent={item.percent}
                      size={44}
                      strokeColor={item.color}
                      strokeWidth={8}
                      format={(p) => `${p}%`}
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                        {item.percent}% · {item.count.toLocaleString("vi-VN")} phim
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Spin>
          </ProCard>

          {/* Top active users */}
          <ProCard title="Người dùng" bordered extra={<a href="/admin/users">Xem tất cả</a>}>
            <Spin spinning={usersLoading}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {users.map((u) => {
                  const topRole = u.roles.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : "ROLE_USER";
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : "?";
                  return (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar
                        src={u.avatar || undefined}
                        style={{ backgroundColor: topRole === "ROLE_ADMIN" ? "#faad14" : "#1677ff", flexShrink: 0 }}
                      >
                        {!u.avatar && initial}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#8c8c8c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.email}
                        </div>
                      </div>
                      <Tag color={ROLE_COLOR[topRole]}>{ROLE_LABEL[topRole]}</Tag>
                    </div>
                  );
                })}
              </div>
            </Spin>
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
