"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormUploadButton,
  ProFormTextArea,
  ProTable,
  StatisticCard,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Alert, App, Badge, Button, Descriptions, Divider, Progress, Space, Tag, Tabs, Typography } from "antd";
import { ReloadOutlined, ThunderboltOutlined, SyncOutlined } from "@ant-design/icons";

const { Text } = Typography;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Import/Crawl Types ───────────────────────────────────────────────────────

type CrawlJob = {
  id: number;
  source: string;
  mode: "crawl" | "csv" | "api";
  status: "running" | "success" | "error";
  imported: number;
  updatedAt: string;
};

// ─── Sync Types ───────────────────────────────────────────────────────────────

type SyncedMovie = {
  id: number;
  slug: string;
  title: string;
  originName: string | null;
  type: string | null;
  quality: string | null;
  lang: string | null;
  year: number | null;
  episodeCurrent: string | null;
  thumbUrl: string | null;
  subDocquyen: boolean;
  createdAt: string;
  modifiedAt: string;
};

type TriggerResult = {
  added: number;
  skipped: number;
};

type ResyncResult = {
  updated: number;
  notFound: number;
  failed: number;
  remaining: number;
};

// ─── Mock data (Import/Crawl tab) ────────────────────────────────────────────

const mockJobs: CrawlJob[] = [
  { id: 1, source: "NguonPhimA", mode: "crawl", status: "success", imported: 120, updatedAt: "06/05/2026 08:40" },
  { id: 2, source: "CSV release_week_18.csv", mode: "csv", status: "success", imported: 68, updatedAt: "05/05/2026 18:20" },
  { id: 3, source: "Partner API B", mode: "api", status: "running", imported: 17, updatedAt: "06/05/2026 10:12" },
];

// ─── Import/Crawl columns ─────────────────────────────────────────────────────

const jobColumns: ProColumns<CrawlJob>[] = [
  { title: "Nguồn", dataIndex: "source" },
  {
    title: "Kiểu",
    dataIndex: "mode",
    render: (_, r) => <Tag color="blue">{r.mode.toUpperCase()}</Tag>,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (_, r) => {
      const map = {
        running: { color: "processing", text: "Đang chạy" },
        success: { color: "success", text: "Hoàn tất" },
        error: { color: "error", text: "Lỗi" },
      } as const;
      return <Tag color={map[r.status].color}>{map[r.status].text}</Tag>;
    },
  },
  { title: "Phim / tập đã import", dataIndex: "imported", search: false },
  { title: "Cập nhật", dataIndex: "updatedAt", search: false },
];

// ─── Sync columns ─────────────────────────────────────────────────────────────

const syncedMovieColumns: ProColumns<SyncedMovie>[] = [
  {
    title: "Slug",
    dataIndex: "slug",
    copyable: true,
    width: 200,
    ellipsis: true,
  },
  {
    title: "Tên phim",
    dataIndex: "title",
    width: 220,
    render: (_, r) => (
      <div>
        <div style={{ fontWeight: 600 }}>{r.title}</div>
        <div style={{ fontSize: 12, color: "#8c8c8c" }}>{r.originName ?? <Text type="warning">Chưa đủ metadata</Text>}</div>
      </div>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "originName",
    width: 140,
    search: false,
    render: (_, r) => {
      if (r.originName === null) return <Badge status="warning" text="Thiếu metadata" />;
      if (r.originName === "") return <Badge status="error" text="Slug hết tồn tại" />;
      return <Badge status="success" text="Đầy đủ" />;
    },
  },
  {
    title: "Loại",
    dataIndex: "type",
    width: 90,
    search: false,
    render: (v) =>
      v ? (
        <Tag color="geekblue">{String(v)}</Tag>
      ) : (
        <Text type="secondary">—</Text>
      ),
  },
  {
    title: "Chất lượng",
    dataIndex: "quality",
    width: 90,
    search: false,
    render: (v) => v ?? <Text type="secondary">—</Text>,
  },
  {
    title: "Ngôn ngữ",
    dataIndex: "lang",
    width: 90,
    search: false,
    render: (v) => v ?? <Text type="secondary">—</Text>,
  },
  {
    title: "Năm",
    dataIndex: "year",
    width: 70,
    search: false,
    render: (v) => v ?? <Text type="secondary">—</Text>,
  },
  {
    title: "Tập hiện tại",
    dataIndex: "episodeCurrent",
    width: 110,
    search: false,
    render: (v) => v ?? <Text type="secondary">—</Text>,
  },
  {
    title: "Sync lúc",
    dataIndex: "createdAt",
    width: 170,
    search: false,
    render: (v) => (v ? new Date(String(v)).toLocaleString("vi-VN") : "—"),
  },
  {
    title: "Cập nhật lần cuối",
    dataIndex: "modifiedAt",
    width: 170,
    search: false,
    render: (v) => (v ? new Date(String(v)).toLocaleString("vi-VN") : "—"),
  },
];

// ─── SyncManagementTab ────────────────────────────────────────────────────────

function SyncManagementTab() {
  const { message } = App.useApp();

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  const [triggerLoading, setTriggerLoading] = useState(false);
  const [triggerResult, setTriggerResult] = useState<TriggerResult | null>(null);
  const [triggerError, setTriggerError] = useState<string | null>(null);

  const [resyncLoading, setResyncLoading] = useState(false);
  const [resyncResult, setResyncResult] = useState<ResyncResult | null>(null);
  const [resyncError, setResyncError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  const tableRef = useRef<ActionType>();

  const fetchCount = useCallback(async () => {
    setCountLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sync/movies/count`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setTotalCount(typeof json?.data === "number" ? json.data : json?.data?.count ?? null);
    } catch {
      message.error("Không thể lấy tổng số phim đã sync");
    } finally {
      setCountLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  const handleTrigger = async (values: { startPage: number; maxPages: number }) => {
    setTriggerLoading(true);
    setTriggerResult(null);
    setTriggerError(null);
    try {
      const res = await fetch(
        `${API_BASE}/sync/movies/trigger?startPage=${values.startPage}&maxPages=${values.maxPages}`,
        { method: "POST" }
      );
      const json = await res.json();
      if (!res.ok || !json?.status) throw new Error(json?.message ?? `HTTP ${res.status}`);
      setTriggerResult(json.data as TriggerResult);
      message.success(`Sync xong: +${json.data?.added ?? 0} phim mới`);
      fetchCount();
      tableRef.current?.reload();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      setTriggerError(msg);
      message.error(`Trigger sync thất bại: ${msg}`);
    } finally {
      setTriggerLoading(false);
    }
  };

  const handleResync = async (limit: number) => {
    setResyncLoading(true);
    setResyncResult(null);
    setResyncError(null);
    try {
      const res = await fetch(`${API_BASE}/sync/movies/resync?limit=${limit}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json?.status) throw new Error(json?.message ?? `HTTP ${res.status}`);
      setResyncResult(json.data as ResyncResult);
      const d = json.data as ResyncResult;
      message.success(`Resync xong: ${d.updated} cập nhật, còn lại ${d.remaining}`);
      fetchCount();
      tableRef.current?.reload();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      setResyncError(msg);
      message.error(`Resync thất bại: ${msg}`);
    } finally {
      setResyncLoading(false);
    }
  };

  return (
    <ProCard ghost gutter={[16, 16]} direction="column">
      {/* Stats */}
      <ProCard ghost>
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: "Tổng phim đã sync vào PostgreSQL",
              value: totalCount ?? "—",
              suffix: totalCount !== null ? "phim" : "",
              loading: countLoading,
            }}
            extra={
              <Button size="small" icon={<ReloadOutlined />} onClick={fetchCount} loading={countLoading}>
                Làm mới
              </Button>
            }
          />
          <StatisticCard
            statistic={{
              title: "Cache TTL (syncedMovies)",
              value: "2 phút",
              description: "Tự evict khi có phim mới được sync",
            }}
          />
          <StatisticCard
            statistic={{
              title: "Scheduler",
              value: "Mỗi 1 phút",
              description: "MovieSyncScheduler tự động sync phim mới",
            }}
          />
        </StatisticCard.Group>
      </ProCard>

      {/* Action cards */}
      <ProCard ghost gutter={[16, 0]}>
        {/* Trigger */}
        <ProCard colSpan={12} title="Kích hoạt Sync thủ công" bordered extra={<ThunderboltOutlined style={{ color: "#faad14" }} />}>
          <ProForm
            layout="vertical"
            onFinish={handleTrigger}
            submitter={{
              render: (_props, _dom) => (
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<ThunderboltOutlined />}
                    loading={triggerLoading}
                  >
                    Trigger Sync
                  </Button>
                </Space>
              ),
            }}
            initialValues={{ startPage: 1, maxPages: 50 }}
          >
            <ProFormDigit
              name="startPage"
              label="Trang bắt đầu (startPage)"
              min={1}
              fieldProps={{ style: { width: "100%" } }}
              tooltip="Trang bắt đầu lấy từ OPhim /danh-sach/phim-moi"
            />
            <ProFormDigit
              name="maxPages"
              label="Số trang tối đa (maxPages)"
              min={1}
              max={200}
              fieldProps={{ style: { width: "100%" } }}
              tooltip="Giới hạn số trang mỗi lần sync, mặc định 50"
            />
          </ProForm>
          {triggerError && <Alert type="error" message={triggerError} showIcon style={{ marginTop: 12 }} />}
          {triggerResult && (
            <Alert
              type="success"
              showIcon
              style={{ marginTop: 12 }}
              message="Sync hoàn tất"
              description={
                <Descriptions size="small" column={2}>
                  <Descriptions.Item label="Phim mới thêm">
                    <Text strong style={{ color: "#52c41a" }}>+{triggerResult.added}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Bỏ qua (trùng)">
                    <Text type="secondary">{triggerResult.skipped}</Text>
                  </Descriptions.Item>
                </Descriptions>
              }
            />
          )}
        </ProCard>

        {/* Resync */}
        <ProCard colSpan={12} title="Resync record cũ (thiếu metadata)" bordered extra={<SyncOutlined style={{ color: "#1677ff" }} />}>
          <ResyncPanel onResync={handleResync} loading={resyncLoading} result={resyncResult} error={resyncError} />
        </ProCard>
      </ProCard>

      {/* Movie list */}
      <ProCard title="Danh sách phim đã sync" bordered>
        {tableError && (
          <Alert
            type="error"
            message={`Lỗi tải danh sách: ${tableError}`}
            showIcon
            closable
            onClose={() => setTableError(null)}
            style={{ marginBottom: 12 }}
          />
        )}
        <ProTable<SyncedMovie>
          rowKey="id"
          actionRef={tableRef}
          columns={syncedMovieColumns}
          request={async (params) => {
            setTableError(null);
            try {
              const page = (params.current ?? 1) - 1;
              const size = params.pageSize ?? 20;
              const res = await fetch(`${API_BASE}/sync/movies?page=${page}&size=${size}`);
              if (!res.ok) {
                let backendMessage = "";
                try {
                  const errJson = await res.json();
                  backendMessage = errJson?.message ? String(errJson.message) : "";
                } catch {
                  backendMessage = "";
                }

                // Fallback for server-side paging issues: fetch latest list and paginate on client.
                if (res.status >= 500) {
                  const fallbackRes = await fetch(`${API_BASE}/sync/movies/all`);
                  if (fallbackRes.ok) {
                    const fallbackJson = await fallbackRes.json();
                    const fallbackRaw = fallbackJson?.data;
                    const allItems: SyncedMovie[] = Array.isArray(fallbackRaw)
                      ? fallbackRaw
                      : Array.isArray(fallbackRaw?.items)
                      ? fallbackRaw.items
                      : Array.isArray(fallbackRaw?.content)
                      ? fallbackRaw.content
                      : [];
                    const start = page * size;
                    const paged = allItems.slice(start, start + size);
                    // Fallback loaded successfully, so do not show blocking error banner.
                    setTableError(null);
                    return { data: paged, success: true, total: allItems.length };
                  }
                }

                setTableError(
                  backendMessage
                    ? `HTTP ${res.status} — ${backendMessage}`
                    : `HTTP ${res.status}${res.statusText ? ` — ${res.statusText}` : ""}`
                );
                return { data: [], success: false, total: 0 };
              }
              const json = await res.json();
              const rawData = json?.data;
              const items: SyncedMovie[] = Array.isArray(rawData)
                ? rawData
                : Array.isArray(rawData?.content)
                ? rawData.content
                : Array.isArray(rawData?.items)
                ? rawData.items
                : [];
              const total: number =
                json?.pagination?.totalItems ??
                rawData?.totalElements ??
                rawData?.totalItems ??
                items.length;
              return { data: items, success: true, total };
            } catch (e: unknown) {
              const msg = e instanceof Error ? e.message : "Lỗi mạng";
              setTableError(msg);
              return { data: [], success: false, total: 0 };
            }
          }}
          search={false}
          scroll={{ x: 1400 }}
          pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ["10", "20", "50"] }}
          toolBarRender={() => [
            <Button key="refresh" icon={<ReloadOutlined />} onClick={() => tableRef.current?.reload()}>
              Làm mới
            </Button>,
          ]}
        />
      </ProCard>
    </ProCard>
  );
}

// ─── ResyncPanel (tách riêng để quản lý state limit) ─────────────────────────

function ResyncPanel({
  onResync,
  loading,
  result,
  error,
}: {
  onResync: (limit: number) => void;
  loading: boolean;
  result: ResyncResult | null;
  error: string | null;
}) {
  const [limit, setLimit] = useState(100);

  return (
    <div>
      <ProForm
        layout="vertical"
        onFinish={async () => onResync(limit)}
        submitter={{
          render: () => (
            <Space>
              <Button type="primary" htmlType="submit" icon={<SyncOutlined />} loading={loading}>
                Chạy Resync
              </Button>
              {result && result.remaining > 0 && (
                <Button onClick={() => onResync(limit)} loading={loading}>
                  Tiếp tục ({result.remaining} còn lại)
                </Button>
              )}
            </Space>
          ),
        }}
      >
        <ProFormDigit
          label="Số slug xử lý mỗi lần (limit)"
          fieldProps={{
            value: limit,
            onChange: (v) => setLimit(v ?? 100),
            style: { width: "100%" },
            min: 1,
            max: 500,
          }}
          tooltip="Mặc định 100, tối đa 500. Gọi lặp lại cho đến khi remaining = 0."
        />
      </ProForm>
      {error && <Alert type="error" message={error} showIcon style={{ marginTop: 12 }} />}
      {result && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          {result.remaining > 0 ? (
            <Alert type="warning" showIcon message={`Còn ${result.remaining} record cần resync — nhấn "Tiếp tục" để chạy thêm`} style={{ marginBottom: 8 }} />
          ) : (
            <Alert type="success" showIcon message="Đã resync xong tất cả record!" style={{ marginBottom: 8 }} />
          )}
          <Progress
            percent={result.remaining === 0 ? 100 : Math.round(((result.updated + result.notFound) / (result.updated + result.notFound + result.remaining)) * 100)}
            size="small"
            status={result.remaining > 0 ? "active" : "success"}
            style={{ marginBottom: 8 }}
          />
          <Descriptions size="small" column={2} bordered>
            <Descriptions.Item label="Đã cập nhật">
              <Text strong style={{ color: "#52c41a" }}>{result.updated}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Slug không còn tồn tại">
              <Text type="warning">{result.notFound}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Lỗi không xác định">
              <Text type="danger">{result.failed}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Còn cần resync">
              <Text strong>{result.remaining}</Text>
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ImportCrawlPage() {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<string>("import");

  return (
    <PageContainer
      title="Import / Crawl & Sync"
      subTitle="Quản lý crawl từ nguồn ngoài và đồng bộ phim từ OPhim vào PostgreSQL"
      tabList={[
        { tab: "Import / Crawl", key: "import" },
        { tab: "Đồng bộ Sync về PostgreSQL", key: "sync" },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "import" && (
        <ProCard ghost gutter={[16, 16]} direction="column">
          <ProCard title="Crawl phim từ nguồn khác" bordered>
            <ProForm
              layout="vertical"
              onFinish={async (values) => {
                console.log(values);
                message.success("Đã lưu cấu hình crawl nguồn mới");
              }}
              submitter={{ searchConfig: { submitText: "Lưu cấu hình crawl" } }}
              initialValues={{ sourceName: "NguonPhimA", schedule: "30", autoUpdateEpisode: true }}
            >
              <ProFormText name="sourceName" label="Tên nguồn" rules={[{ required: true }]} />
              <ProFormText name="baseUrl" label="Base URL nguồn phim" placeholder="https://api.example.com" rules={[{ required: true }]} />
              <ProFormText name="apiKey" label="API Key / Token" placeholder="Nhập token nếu có" />
              <ProFormSelect
                name="schedule"
                label="Chu kỳ crawl (phút)"
                options={[
                  { label: "15 phút", value: "15" },
                  { label: "30 phút", value: "30" },
                  { label: "60 phút", value: "60" },
                  { label: "180 phút", value: "180" },
                ]}
              />
              <ProFormSwitch name="autoUpdateEpisode" label="Tự động cập nhật tập mới" />
            </ProForm>
          </ProCard>

          <ProCard title="Import hàng loạt (CSV / API)" bordered>
            <Tabs
              items={[
                {
                  key: "csv",
                  label: "Import CSV",
                  children: (
                    <ProForm
                      layout="vertical"
                      onFinish={async (values) => {
                        console.log(values);
                        message.success("Đã tạo job import CSV");
                      }}
                      submitter={{ searchConfig: { submitText: "Bắt đầu import CSV" } }}
                    >
                      <ProFormUploadButton
                        name="csvFile"
                        label="Tệp CSV phim"
                        max={1}
                        title="Tải file CSV"
                        fieldProps={{ accept: ".csv" }}
                        rules={[{ required: true, message: "Vui lòng chọn tệp CSV" }]}
                      />
                      <ProFormSwitch name="overwrite" label="Ghi đè phim đã tồn tại" initialValue={false} />
                    </ProForm>
                  ),
                },
                {
                  key: "api",
                  label: "Import qua API",
                  children: (
                    <ProForm
                      layout="vertical"
                      onFinish={async (values) => {
                        console.log(values);
                        message.success("Đã tạo job import API");
                      }}
                      submitter={{ searchConfig: { submitText: "Bắt đầu import API" } }}
                    >
                      <ProFormText name="endpoint" label="API Endpoint" placeholder="https://partner.example.com/movies" rules={[{ required: true }]} />
                      <ProFormTextArea name="headers" label="Headers JSON" placeholder='{"Authorization":"Bearer xxx"}' fieldProps={{ rows: 3 }} />
                      <ProFormText name="mappingProfile" label="Profile mapping dữ liệu" placeholder="default-movie-map" />
                    </ProForm>
                  ),
                },
              ]}
            />
          </ProCard>

          <ProCard title="Lịch sử job import / crawl" bordered>
            <ProTable<CrawlJob>
              rowKey="id"
              columns={jobColumns}
              request={async () => ({ data: mockJobs, success: true, total: mockJobs.length })}
              locale={{ emptyText: "Chưa có phim nào được sync vào PostgreSQL" }}
              pagination={{ pageSize: 8 }}
            />
          </ProCard>
        </ProCard>
      )}

      {activeTab === "sync" && <SyncManagementTab />}
    </PageContainer>
  );
}
