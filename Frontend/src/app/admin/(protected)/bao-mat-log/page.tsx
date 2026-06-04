"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  PageContainer, ProCard, ProTable, ProForm,
  ProFormSwitch, ProFormSelect, StatisticCard,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { App, Button, Space, Tag, Badge, Spin, Alert, Tooltip, Modal, Table, Typography, Popconfirm, Breadcrumb } from "antd";
import {
  SafetyOutlined, WarningOutlined, ClockCircleOutlined,
  CloudUploadOutlined, ReloadOutlined, CheckCircleOutlined,
  DownloadOutlined, DeleteOutlined, FolderOpenOutlined,
  FolderOutlined, FileOutlined, ArrowLeftOutlined, EyeOutlined,
} from "@ant-design/icons";
import {
  apiGetSecuritySettings, apiSaveSecuritySettings, apiGetLoginLogs,
  apiGetSecurityStats, apiGetSecurityAlerts, apiGetBackups, apiTriggerBackup,
  apiDeleteBackup, apiDownloadBackup, apiGetBackupFiles, apiReadBackupFile,
  type LoginLog, type SecurityAlert, type BackupRecord, type SecuritySettings,
  type BackupFileEntry, type BackupDirResult, type BackupFileContent,
} from "@/lib/api/security";
import {
  saveSecuritySettings as saveClientSettings,
} from "@/lib/security-settings";

const { Text } = Typography;

// ── Columns ──────────────────────────────────────────────────────────────────

const loginColumns: ProColumns<LoginLog>[] = [
  {
    title: "Tài khoản",
    dataIndex: "email",
  },
  {
    title: "IP",
    dataIndex: "ip",
    render: (_, r) => <code style={{ fontSize: 12 }}>{r.ip}</code>,
  },
  {
    title: "Thiết bị / UA",
    dataIndex: "userAgent",
    search: false,
    ellipsis: true,
    render: (_, r) => (
      <Tooltip title={r.userAgent ?? "—"}>
        <span style={{ fontSize: 12 }}>{r.userAgent ? r.userAgent.slice(0, 40) + (r.userAgent.length > 40 ? "…" : "") : "—"}</span>
      </Tooltip>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    valueType: "select",
    valueEnum: {
      success: { text: "Thành công" },
      failed: { text: "Thất bại" },
    },
    render: (_, r) => (
      <Tag color={r.status === "success" ? "success" : "error"}>
        {r.status === "success" ? "Thành công" : "Thất bại"}
      </Tag>
    ),
  },
  {
    title: "Lý do thất bại",
    dataIndex: "failReason",
    search: false,
    render: (_, r) => r.failReason ?? "—",
  },
  {
    title: "Thời gian",
    dataIndex: "createdAt",
    search: false,
    render: (_, r) => new Date(r.createdAt).toLocaleString("vi-VN"),
  },
];

const alertColumns: ProColumns<SecurityAlert>[] = [
  {
    title: "Loại bất thường",
    dataIndex: "type",
    render: (_, r) => {
      const map: Record<string, string> = {
        bruteforce: "Brute-force theo email",
        bruteforce_ip: "Brute-force theo IP",
      };
      return map[r.type] ?? r.type;
    },
  },
  {
    title: "Mức độ",
    dataIndex: "severity",
    render: (_, r) => {
      const map = {
        high: { color: "error", text: "Cao" },
        medium: { color: "warning", text: "Trung bình" },
        low: { color: "default", text: "Thấp" },
      } as const;
      const s = r.severity as keyof typeof map;
      return <Tag color={map[s]?.color ?? "default"}>{map[s]?.text ?? r.severity}</Tag>;
    },
  },
  { title: "Đối tượng", dataIndex: "target", render: (_, r) => <code style={{ fontSize: 12 }}>{r.target}</code> },
  { title: "Chi tiết", dataIndex: "detail" },
  {
    title: "Phát hiện lúc",
    dataIndex: "detectedAt",
    render: (_, r) => new Date(r.detectedAt).toLocaleString("vi-VN"),
  },
];

function BackupColumns(
  onDownload: (r: BackupRecord) => void,
  onDelete: (r: BackupRecord) => void,
): ProColumns<BackupRecord>[] {
  return [
    { title: "File", dataIndex: "filename", ellipsis: true, render: (_, r) => <code style={{ fontSize: 12 }}>{r.filename}</code> },
    { title: "Loại", dataIndex: "type", width: 90, render: (_, r) => <Tag>{r.type === "manual" ? "Thủ công" : "Lịch"}</Tag> },
    { title: "Dung lượng", dataIndex: "sizeLabel", width: 100, render: (_, r) => r.sizeLabel ?? "—" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 110,
      render: (_, r) => {
        const map = { done: { color: "success" as const, text: "Hoàn tất" }, running: { color: "processing" as const, text: "Đang chạy" }, failed: { color: "error" as const, text: "Lỗi" } };
        return <Badge status={map[r.status].color} text={map[r.status].text} />;
      },
    },
    { title: "Kích hoạt bởi", dataIndex: "triggeredBy", width: 130, render: (_, r) => r.triggeredBy ?? "—" },
    { title: "Thời gian tạo", dataIndex: "createdAt", width: 150, render: (_, r) => new Date(r.createdAt).toLocaleString("vi-VN") },
    {
      title: "Thao tác",
      valueType: "option",
      width: 110,
      render: (_, r) => (
        <Space>
          <Tooltip title={r.fileExists ? "Tải xuống" : "File không tồn tại trên disk"}>
            <Button
              type="link" size="small" icon={<DownloadOutlined />}
              disabled={!r.fileExists || r.status !== "done"}
              onClick={() => onDownload(r)}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Popconfirm
              title="Xoá bản backup này?"
              description="File trên disk và bản ghi sẽ bị xoá vĩnh viễn."
              okText="Xoá" okButtonProps={{ danger: true }} cancelText="Huỷ"
              onConfirm={() => onDelete(r)}
            >
              <Button danger type="link" size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BaoMatLogPage() {
  const { message } = App.useApp();
  const loginRef  = useRef<ActionType | undefined>(undefined);
  const backupRef = useRef<ActionType | undefined>(undefined);

  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [stats, setStats]       = useState({ total24h: 0, failed24h: 0, success24h: 0 });
  const [alerts, setAlerts]     = useState<SecurityAlert[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [backingUp, setBackingUp]       = useState(false);
  const [browseOpen, setBrowseOpen]     = useState(false);
  const [browseFiles, setBrowseFiles]   = useState<BackupFileEntry[]>([]);
  const [browseDir, setBrowseDir]       = useState("");
  const [browseLoading, setBrowseLoading] = useState(false);

  const loadInit = useCallback(async () => {
    try {
      const [settingsRes, statsRes, alertsRes] = await Promise.all([
        apiGetSecuritySettings(),
        apiGetSecurityStats(),
        apiGetSecurityAlerts(),
      ]);
      setSettings(settingsRes.settings);
      setStats(statsRes);
      setAlerts(alertsRes);
    } catch {
      message.error("Không thể tải dữ liệu bảo mật");
    } finally {
      setLoadingInit(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadInit(); }, [loadInit]);

  async function handleSaveSettings(values: Record<string, unknown>) {
    try {
      await apiSaveSecuritySettings(values as Partial<SecuritySettings>);
      // Sync client-side protection settings immediately
      saveClientSettings({
        enableClientProtection:    Boolean(values.enableClientProtection),
        blockDevToolsKeyShortcuts: Boolean(values.blockDevToolsKeyShortcuts),
        blockContextMenu:          Boolean(values.blockContextMenu),
        blockViewSourceShortcut:   Boolean(values.blockViewSourceShortcut),
        blockCopySelection:        Boolean(values.blockCopySelection),
        blockPrintShortcut:        Boolean(values.blockPrintShortcut),
        blockSaveShortcut:         Boolean(values.blockSaveShortcut),
        blurWhenTabHidden:         Boolean(values.blurWhenTabHidden),
        frameBustProtection:       Boolean(values.frameBustProtection),
      });
      setSettings((prev) => prev ? { ...prev, ...values } as SecuritySettings : prev);
      message.success("Đã lưu cấu hình bảo mật");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Lưu thất bại");
    }
  }

  async function handleTriggerBackup() {
    setBackingUp(true);
    try {
      const result = await apiTriggerBackup();
      message.success(`Đã kích hoạt backup: ${result.filename}`);
      setTimeout(() => backupRef.current?.reload(), 3500);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Backup thất bại");
    } finally {
      setBackingUp(false);
    }
  }

  async function handleDownload(record: BackupRecord) {
    try {
      await apiDownloadBackup(record.id, record.filename);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Tải file thất bại");
    }
  }

  async function handleDeleteBackup(record: BackupRecord) {
    try {
      await apiDeleteBackup(record.id);
      message.success("Đã xoá bản backup");
      backupRef.current?.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Xoá thất bại");
    }
  }

  async function handleBrowse() {
    setBrowseOpen(true);
    setBrowseLoading(true);
    try {
      const result = await apiGetBackupFiles();
      setBrowseDir(result.dir);
      setBrowseFiles(result.files);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không thể đọc thư mục");
    } finally {
      setBrowseLoading(false);
    }
  }

  if (loadingInit) {
    return (
      <PageContainer title="Bảo mật & Log">
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Bảo mật & Log" subTitle="Log đăng nhập, phát hiện bất thường và backup dữ liệu">
      <ProCard ghost gutter={[16, 16]} direction="column">

        {/* ── Thống kê 24h ────────────────────────────────────────────────── */}
        <ProCard ghost gutter={[16, 16]} wrap>
          <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
            <StatisticCard statistic={{
              title: "Lượt đăng nhập (24h)", value: stats.total24h,
              icon: <ClockCircleOutlined style={{ color: "#1677ff" }} />,
            }} />
          </ProCard>
          <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
            <StatisticCard statistic={{
              title: "Đăng nhập thành công", value: stats.success24h,
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            }} />
          </ProCard>
          <ProCard colSpan={{ xs: 24, md: 8 }} bordered>
            <StatisticCard statistic={{
              title: "Đăng nhập thất bại", value: stats.failed24h,
              icon: <WarningOutlined style={{ color: "#ff4d4f" }} />,
            }} />
          </ProCard>
        </ProCard>

        {/* ── Bất thường ──────────────────────────────────────────────────── */}
        {alerts.length > 0 && (
          <Alert
            type="error"
            showIcon
            icon={<WarningOutlined />}
            message={`Phát hiện ${alerts.length} bất thường trong 15 phút qua`}
            description={alerts.map((a) => `• ${a.target}: ${a.detail}`).join("\n")}
            style={{ whiteSpace: "pre-line" }}
          />
        )}

        {/* ── Cấu hình bảo mật ────────────────────────────────────────────── */}
        <ProCard title="Cấu hình bảo mật" bordered extra={<SafetyOutlined />}>
          {settings ? (
            <ProForm
              key={JSON.stringify(settings)}
              layout="vertical"
              initialValues={settings}
              onFinish={async (values) => { await handleSaveSettings(values); return true; }}
              submitter={{ searchConfig: { submitText: "Lưu cấu hình" } }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1">
                <ProFormSwitch name="enable2FA"                label="Bắt buộc 2FA cho tài khoản admin" />
                <ProFormSwitch name="detectAnomaly"            label="Bật phát hiện truy cập bất thường" />
                <ProFormSwitch name="enableClientProtection"   label="Bật bảo vệ frontend" />
                <ProFormSwitch name="blockDevToolsKeyShortcuts" label="Chặn F12 / Ctrl+Shift+I/J/C/K" />
                <ProFormSwitch name="blockViewSourceShortcut"  label="Chặn Ctrl+U (view source)" />
                <ProFormSwitch name="blockContextMenu"         label="Chặn chuột phải (context menu)" />
                <ProFormSwitch name="blockCopySelection"       label="Chặn copy/cut/select text" />
                <ProFormSwitch name="blockPrintShortcut"       label="Chặn Ctrl+P (in trang)" />
                <ProFormSwitch name="blockSaveShortcut"        label="Chặn Ctrl+S (save trang)" />
                <ProFormSwitch name="blurWhenTabHidden"        label="Làm mờ nội dung khi tab bị ẩn" />
                <ProFormSwitch name="frameBustProtection"      label="Chống nhúng iframe trái phép" />
              </div>
              <ProForm.Group>
                <ProFormSelect
                  width="sm"
                  name="backupSchedule"
                  label="Lịch backup tự động"
                  options={[
                    { label: "Mỗi ngày",  value: "daily" },
                    { label: "Mỗi 12 giờ", value: "12h" },
                    { label: "Mỗi tuần",  value: "weekly" },
                  ]}
                />
                <ProFormSelect
                  width="sm"
                  name="backupRetention"
                  label="Lưu bản backup (ngày)"
                  options={["7","15","30","60","90"].map((v) => ({ label: `${v} ngày`, value: v }))}
                />
              </ProForm.Group>
            </ProForm>
          ) : (
            <Alert type="warning" message="Không tải được cấu hình" />
          )}
        </ProCard>

        {/* ── Log đăng nhập ───────────────────────────────────────────────── */}
        <ProCard title="Log đăng nhập" bordered>
          <ProTable<LoginLog>
            actionRef={loginRef}
            rowKey="id"
            columns={loginColumns}
            request={async (params) => {
              try {
                const res = await apiGetLoginLogs({
                  page: params.current,
                  size: params.pageSize,
                  email: params.email as string | undefined,
                  status: params.status as string | undefined,
                  ip: params.ip as string | undefined,
                });
                return { data: res.data, success: true, total: res.total };
              } catch {
                return { data: [], success: false, total: 0 };
              }
            }}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            search={{ labelWidth: "auto" }}
            toolBarRender={() => [
              <Button key="refresh" icon={<ReloadOutlined />} onClick={() => loginRef.current?.reload()}>
                Làm mới
              </Button>,
            ]}
          />
        </ProCard>

        {/* ── Bất thường ──────────────────────────────────────────────────── */}
        <ProCard title="Phát hiện bất thường" bordered>
          <ProTable<SecurityAlert>
            rowKey="id"
            columns={alertColumns}
            request={async () => {
              const data = await apiGetSecurityAlerts();
              return { data, success: true, total: data.length };
            }}
            search={false}
            pagination={{ pageSize: 8 }}
            toolBarRender={() => [
              <Button key="refresh" icon={<ReloadOutlined />} onClick={() => loadInit()}>
                Làm mới
              </Button>,
            ]}
          />
        </ProCard>

        {/* ── Backup ──────────────────────────────────────────────────────── */}
        <ProCard
          title="Lịch sử Backup"
          bordered
          extra={
            <Space>
              <Button icon={<FolderOpenOutlined />} onClick={handleBrowse}>
                Xem thư mục
              </Button>
              <Button
                type="primary" icon={<CloudUploadOutlined />}
                loading={backingUp} onClick={handleTriggerBackup}
              >
                Backup ngay
              </Button>
            </Space>
          }
        >
          <ProTable<BackupRecord>
            actionRef={backupRef}
            rowKey="id"
            columns={BackupColumns(handleDownload, handleDeleteBackup)}
            request={async (params) => {
              try {
                const res = await apiGetBackups({ page: params.current, size: params.pageSize });
                return { data: res.data, success: true, total: res.total };
              } catch {
                return { data: [], success: false, total: 0 };
              }
            }}
            search={false}
            pagination={{ pageSize: 10 }}
            toolBarRender={() => [
              <Button key="r" icon={<ReloadOutlined />} onClick={() => backupRef.current?.reload()}>Làm mới</Button>,
            ]}
          />
        </ProCard>

        {/* ── Modal duyệt thư mục backup ──────────────────────────────────── */}
        <Modal
          title={<Space><FolderOpenOutlined /> Thư mục Backup</Space>}
          open={browseOpen}
          onCancel={() => setBrowseOpen(false)}
          footer={null}
          width={700}
        >
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
            📁 {browseDir}
          </Text>
          <Table<BackupFileEntry>
            loading={browseLoading}
            dataSource={browseFiles}
            rowKey="name"
            size="small"
            pagination={false}
            columns={[
              {
                title: "Tên",
                dataIndex: "name",
                render: (_, r) => (
                  <Space>
                    {r.isDirectory
                      ? <FolderOutlined style={{ color: "#faad14" }} />
                      : <FileOutlined style={{ color: "#1677ff" }} />}
                    <Text style={{ fontFamily: "monospace", fontSize: 13 }}>{r.name}</Text>
                  </Space>
                ),
              },
              {
                title: "Loại", width: 90,
                render: (_, r) => <Tag>{r.isDirectory ? "Thư mục" : "File"}</Tag>,
              },
              { title: "Dung lượng", dataIndex: "sizeLabel", width: 110 },
            ]}
            locale={{ emptyText: "Thư mục trống (chưa có file backup nào)" }}
          />
        </Modal>

      </ProCard>
    </PageContainer>
  );
}
