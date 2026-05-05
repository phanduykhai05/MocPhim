"use client";

import React from "react";
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormUploadButton,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { App, Tag, Tabs } from "antd";

type CrawlJob = {
  id: number;
  source: string;
  mode: "crawl" | "csv" | "api";
  status: "running" | "success" | "error";
  imported: number;
  updatedAt: string;
};

const mockJobs: CrawlJob[] = [
  { id: 1, source: "NguonPhimA", mode: "crawl", status: "success", imported: 120, updatedAt: "06/05/2026 08:40" },
  { id: 2, source: "CSV release_week_18.csv", mode: "csv", status: "success", imported: 68, updatedAt: "05/05/2026 18:20" },
  { id: 3, source: "Partner API B", mode: "api", status: "running", imported: 17, updatedAt: "06/05/2026 10:12" },
];

const jobColumns: ProColumns<CrawlJob>[] = [
  {
    title: "Nguồn",
    dataIndex: "source",
  },
  {
    title: "Kiểu",
    dataIndex: "mode",
    valueEnum: {
      crawl: { text: "Crawl" },
      csv: { text: "CSV" },
      api: { text: "API" },
    },
    render: (_, record) => <Tag color="blue">{record.mode.toUpperCase()}</Tag>,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (_, record) => {
      const map = {
        running: { color: "processing", text: "Đang chạy" },
        success: { color: "success", text: "Hoàn tất" },
        error: { color: "error", text: "Lỗi" },
      } as const;
      return <Tag color={map[record.status].color}>{map[record.status].text}</Tag>;
    },
  },
  {
    title: "Phim / tập đã import",
    dataIndex: "imported",
    search: false,
  },
  {
    title: "Cập nhật",
    dataIndex: "updatedAt",
    search: false,
  },
];

export default function ImportCrawlPage() {
  const { message } = App.useApp();

  return (
    <PageContainer title="Import / Crawl phim" subTitle="Crawl từ nguồn khác, import hàng loạt và tự động cập nhật tập mới">
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
            search={false}
            pagination={{ pageSize: 8 }}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
