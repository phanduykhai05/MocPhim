"use client";

import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSwitch,
  ProFormSelect,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { App, Button, Input, Space, Tag, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteAdminCache } from "@/lib/api/sync";

const { Text } = Typography;

const CACHE_PRESETS = [
  { label: "Sync Movies", key: "sync:movies" },
  { label: "Home", key: "home" },
  { label: "Categories", key: "categories" },
  { label: "Countries", key: "countries" },
  { label: "Tất cả (**)", key: "**" },
];

function CacheManagementCard() {
  const { message } = App.useApp();
  const [customPattern, setCustomPattern] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleDelete = async (pattern: string) => {
    if (!pattern.trim()) {
      message.warning("Vui lòng nhập cache key");
      return;
    }
    setLoadingKey(pattern);
    try {
      const accessToken = localStorage.getItem("accessToken") ?? undefined;
      const ok = await deleteAdminCache(pattern.trim(), accessToken);
      if (ok) {
        message.success(`Đã xóa cache: ${pattern}`);
      } else {
        message.error(`Xóa cache thất bại: ${pattern}`);
      }
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <ProCard
      title="Quản lý Cache"
      bordered
      extra={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Preset cache keys — nhấn để xóa ngay:
          </Text>
          <div
            style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            {CACHE_PRESETS.map((p) => (
              <Button
                key={p.key}
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={loadingKey === p.key}
                onClick={() => handleDelete(p.key)}
              >
                {p.label}
                <Tag color="default" style={{ marginLeft: 4, fontSize: 10 }}>
                  {p.key}
                </Tag>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Cache key tùy chỉnh:
          </Text>
          <Space.Compact style={{ width: "100%", marginTop: 8 }}>
            <Input
              placeholder="Nhập cache key pattern (vd: sync:movies, **)"
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              onPressEnter={() => handleDelete(customPattern)}
              allowClear
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={loadingKey === customPattern && customPattern !== ""}
              onClick={() => handleDelete(customPattern)}
            >
              Xóa
            </Button>
          </Space.Compact>
          <Text
            type="secondary"
            style={{ fontSize: 11, marginTop: 4, display: "block" }}
          >
            Dùng <code>**</code> để xóa toàn bộ cache. Endpoint:{" "}
            <code>DELETE /api/v1/admin/cache/&#123;pattern&#125;</code>
          </Text>
        </div>
      </Space>
    </ProCard>
  );
}

export default function CaiDatPage() {
  const { message } = App.useApp();

  return (
    <PageContainer title="Cài đặt hệ thống">
      <ProCard ghost gutter={[0, 16]} direction="column">
        {/* Thông tin website */}
        <ProCard title="Thông tin website" bordered>
          <ProForm
            layout="vertical"
            onFinish={async (values) => {
              console.log(values);
              message.success("Đã lưu thông tin website!");
            }}
            initialValues={{
              siteName: "MocPhim",
              siteUrl: "https://mocphim.vn",
              siteDescription: "Website xem phim online chất lượng cao",
              contactEmail: "admin@mocphim.vn",
            }}
            submitter={{
              searchConfig: {
                submitText: "Lưu thay đổi",
                resetText: "Đặt lại",
              },
            }}
          >
            <ProForm.Group>
              <ProFormText
                name="siteName"
                label="Tên website"
                width="md"
                rules={[{ required: true }]}
              />
              <ProFormText
                name="siteUrl"
                label="URL website"
                width="md"
                rules={[
                  { required: true },
                  { type: "url", message: "URL không hợp lệ" },
                ]}
              />
            </ProForm.Group>
            <ProFormTextArea
              name="siteDescription"
              label="Mô tả"
              fieldProps={{ rows: 3 }}
            />
            <ProFormText
              name="contactEmail"
              label="Email liên hệ"
              width="md"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            />
            <ProFormUploadButton
              name="logo"
              label="Logo website"
              max={1}
              fieldProps={{ listType: "picture-card", accept: "image/*" }}
              title="Tải lên"
            />
          </ProForm>
        </ProCard>

        {/* Cài đặt nội dung */}
        <ProCard title="Cài đặt nội dung" bordered>
          <ProForm
            layout="vertical"
            onFinish={async (values) => {
              console.log(values);
              message.success("Đã lưu cài đặt nội dung!");
            }}
            initialValues={{
              moviesPerPage: "24",
              defaultQuality: "HD",
              enableComments: true,
              requireApproval: false,
              enableWatermark: true,
            }}
            submitter={{
              searchConfig: {
                submitText: "Lưu thay đổi",
                resetText: "Đặt lại",
              },
            }}
          >
            <ProForm.Group>
              <ProFormSelect
                name="moviesPerPage"
                label="Số phim mỗi trang"
                width="sm"
                options={["12", "24", "36", "48"].map((v) => ({
                  label: v,
                  value: v,
                }))}
              />
              <ProFormSelect
                name="defaultQuality"
                label="Chất lượng mặc định"
                width="sm"
                options={["SD", "HD", "Full HD", "4K"].map((v) => ({
                  label: v,
                  value: v,
                }))}
              />
            </ProForm.Group>
            <ProFormSwitch name="enableComments" label="Cho phép bình luận" />
            <ProFormSwitch
              name="requireApproval"
              label="Bình luận cần duyệt trước"
            />
            <ProFormSwitch
              name="enableWatermark"
              label="Thêm watermark vào ảnh thumbnail"
            />
          </ProForm>
        </ProCard>

        {/* Cache management */}
        <CacheManagementCard />

        {/* Cài đặt SEO */}
        <ProCard title="SEO" bordered>
          <ProForm
            layout="vertical"
            onFinish={async (values) => {
              console.log(values);
              message.success("Đã lưu cài đặt SEO!");
            }}
            initialValues={{
              metaTitle: "MocPhim - Xem phim online HD miễn phí",
              metaDescription:
                "MocPhim cung cấp kho phim online chất lượng HD, Vietsub cập nhật nhanh nhất",
              googleAnalyticsId: "",
            }}
            submitter={{
              searchConfig: {
                submitText: "Lưu thay đổi",
                resetText: "Đặt lại",
              },
            }}
          >
            <ProFormText
              name="metaTitle"
              label="Meta Title"
              rules={[{ max: 60, message: "Tối đa 60 ký tự" }]}
            />
            <ProFormTextArea
              name="metaDescription"
              label="Meta Description"
              fieldProps={{ rows: 3 }}
              rules={[{ max: 160, message: "Tối đa 160 ký tự" }]}
            />
            <ProFormText
              name="googleAnalyticsId"
              label="Google Analytics ID"
              width="md"
              placeholder="G-XXXXXXXXXX"
            />
          </ProForm>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
