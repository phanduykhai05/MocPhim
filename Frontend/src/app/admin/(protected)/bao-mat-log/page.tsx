"use client";

import React, { useEffect, useState } from "react";
import {
  PageContainer,
  ProCard,
  ProTable,
  ProForm,
  ProFormSwitch,
  ProFormSelect,
} from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Tag } from "antd";
import {
  DEFAULT_SECURITY_SETTINGS,
  loadSecuritySettings,
  saveSecuritySettings,
} from "@/lib/security-settings";

type LoginLog = {
  id: number;
  user: string;
  ip: string;
  device: string;
  status: "success" | "failed";
  time: string;
};

type AlertLog = {
  id: number;
  type: "bruteforce" | "new_location" | "token_abuse";
  severity: "high" | "medium" | "low";
  target: string;
  detectedAt: string;
};

type BackupLog = {
  id: number;
  file: string;
  size: string;
  status: "done" | "running" | "failed";
  createdAt: string;
};

const loginLogs: LoginLog[] = [
  { id: 1, user: "admin@mocphim.vn", ip: "113.172.45.21", device: "Chrome / Win11", status: "success", time: "06/05/2026 09:20" },
  { id: 2, user: "editor@mocphim.vn", ip: "42.113.90.11", device: "Edge / Win11", status: "success", time: "06/05/2026 08:12" },
  { id: 3, user: "admin@mocphim.vn", ip: "185.201.12.8", device: "Unknown", status: "failed", time: "06/05/2026 07:54" },
];

const alerts: AlertLog[] = [
  { id: 1, type: "bruteforce", severity: "high", target: "admin@mocphim.vn", detectedAt: "06/05/2026 07:55" },
  { id: 2, type: "new_location", severity: "medium", target: "editor@mocphim.vn", detectedAt: "05/05/2026 22:10" },
  { id: 3, type: "token_abuse", severity: "high", target: "API token #A102", detectedAt: "05/05/2026 20:44" },
];

const backups: BackupLog[] = [
  { id: 1, file: "backup-2026-05-06.sql.gz", size: "2.4 GB", status: "done", createdAt: "06/05/2026 02:00" },
  { id: 2, file: "backup-2026-05-05.sql.gz", size: "2.3 GB", status: "done", createdAt: "05/05/2026 02:00" },
  { id: 3, file: "backup-media-2026-05-04.tar.gz", size: "16.8 GB", status: "running", createdAt: "06/05/2026 10:15" },
];

const loginColumns: ProColumns<LoginLog>[] = [
  { title: "Tài khoản", dataIndex: "user" },
  { title: "IP", dataIndex: "ip" },
  { title: "Thiết bị", dataIndex: "device", search: false },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (_, record) => (
      <Tag color={record.status === "success" ? "success" : "error"}>
        {record.status === "success" ? "Thành công" : "Thất bại"}
      </Tag>
    ),
  },
  { title: "Thời gian", dataIndex: "time", search: false },
];

const alertColumns: ProColumns<AlertLog>[] = [
  {
    title: "Loại bất thường",
    dataIndex: "type",
    render: (_, record) => {
      const map = {
        bruteforce: "Tấn công brute-force",
        new_location: "Đăng nhập từ vị trí mới",
        token_abuse: "Lạm dụng API token",
      } as const;
      return map[record.type];
    },
  },
  {
    title: "Mức độ",
    dataIndex: "severity",
    render: (_, record) => {
      const map = {
        high: { color: "error", text: "Cao" },
        medium: { color: "warning", text: "Trung bình" },
        low: { color: "default", text: "Thấp" },
      } as const;
      return <Tag color={map[record.severity].color}>{map[record.severity].text}</Tag>;
    },
  },
  { title: "Đối tượng", dataIndex: "target" },
  { title: "Thời điểm phát hiện", dataIndex: "detectedAt", search: false },
];

const backupColumns: ProColumns<BackupLog>[] = [
  { title: "File backup", dataIndex: "file" },
  { title: "Dung lượng", dataIndex: "size", search: false },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (_, record) => {
      const map = {
        done: { color: "success", text: "Hoàn tất" },
        running: { color: "processing", text: "Đang chạy" },
        failed: { color: "error", text: "Lỗi" },
      } as const;
      return <Tag color={map[record.status].color}>{map[record.status].text}</Tag>;
    },
  },
  { title: "Tạo lúc", dataIndex: "createdAt", search: false },
];

export default function BaoMatLogPage() {
  const { message } = App.useApp();
  const [formInitialValues, setFormInitialValues] = useState({
    enable2FA: false,
    detectAnomaly: true,
    backupSchedule: "daily",
    backupRetention: "30",
    ...DEFAULT_SECURITY_SETTINGS,
  });

  useEffect(() => {
    const runtimeSecuritySettings = loadSecuritySettings();
    setFormInitialValues((prev) => ({ ...prev, ...runtimeSecuritySettings }));
  }, []);

  return (
    <PageContainer title="Bảo mật & log" subTitle="Log đăng nhập, phát hiện bất thường và backup dữ liệu">
      <ProCard ghost gutter={[16, 16]} direction="column">
        <ProCard title="Cấu hình bảo mật" bordered>
          <ProForm
            key={JSON.stringify(formInitialValues)}
            layout="vertical"
            initialValues={formInitialValues}
            onFinish={async (values) => {
              saveSecuritySettings({
                enableClientProtection: Boolean(values.enableClientProtection),
                blockDevToolsKeyShortcuts: Boolean(values.blockDevToolsKeyShortcuts),
                blockContextMenu: Boolean(values.blockContextMenu),
                blockViewSourceShortcut: Boolean(values.blockViewSourceShortcut),
                blockCopySelection: Boolean(values.blockCopySelection),
                blockPrintShortcut: Boolean(values.blockPrintShortcut),
                blockSaveShortcut: Boolean(values.blockSaveShortcut),
                blurWhenTabHidden: Boolean(values.blurWhenTabHidden),
                frameBustProtection: Boolean(values.frameBustProtection),
              });
              console.log(values);
              message.success("Đã lưu cấu hình bảo mật và áp dụng ngay");
            }}
            submitter={{ searchConfig: { submitText: "Lưu cấu hình" } }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1">
              <ProFormSwitch name="enable2FA" label="Bắt buộc 2FA cho tài khoản admin" />
              <ProFormSwitch name="detectAnomaly" label="Bật phát hiện truy cập bất thường" />
              <ProFormSwitch name="enableClientProtection" label="Bật bảo vệ frontend" />
              <ProFormSwitch name="blockDevToolsKeyShortcuts" label="Chặn F12 / Ctrl+Shift+I/J/C/K" />
              <ProFormSwitch name="blockViewSourceShortcut" label="Chặn Ctrl+U (view source)" />
              <ProFormSwitch name="blockContextMenu" label="Chặn chuột phải (context menu)" />
              <ProFormSwitch name="blockCopySelection" label="Chặn copy/cut/select text" />
              <ProFormSwitch name="blockPrintShortcut" label="Chặn Ctrl+P (in trang)" />
              <ProFormSwitch name="blockSaveShortcut" label="Chặn Ctrl+S (save trang)" />
              <ProFormSwitch name="blurWhenTabHidden" label="Làm mờ nội dung khi tab bị ẩn" />
              <ProFormSwitch name="frameBustProtection" label="Chống nhúng iframe trái phép" />
            </div>
            <ProForm.Group>
              <ProFormSelect
                width="sm"
                name="backupSchedule"
                label="Lịch backup"
                options={[
                  { label: "Mỗi ngày", value: "daily" },
                  { label: "Mỗi 12 giờ", value: "12h" },
                  { label: "Mỗi tuần", value: "weekly" },
                ]}
              />
              <ProFormSelect
                width="sm"
                name="backupRetention"
                label="Lưu bản backup (ngày)"
                options={["7", "15", "30", "60", "90"].map((v) => ({ label: `${v} ngày`, value: v }))}
              />
            </ProForm.Group>
          </ProForm>
        </ProCard>

        <ProCard title="Log đăng nhập" bordered>
          <ProTable<LoginLog>
            rowKey="id"
            columns={loginColumns}
            request={async () => ({ data: loginLogs, success: true, total: loginLogs.length })}
            pagination={{ pageSize: 6 }}
          />
        </ProCard>

        <ProCard title="Truy cập bất thường" bordered>
          <ProTable<AlertLog>
            rowKey="id"
            columns={alertColumns}
            request={async () => ({ data: alerts, success: true, total: alerts.length })}
            search={false}
            pagination={{ pageSize: 6 }}
          />
        </ProCard>

        <ProCard title="Lịch sử backup dữ liệu" bordered>
          <ProTable<BackupLog>
            rowKey="id"
            columns={backupColumns}
            request={async () => ({ data: backups, success: true, total: backups.length })}
            search={false}
            pagination={{ pageSize: 6 }}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
