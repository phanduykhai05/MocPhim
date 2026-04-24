"use client";

import React from "react";
import { PageContainer, ProCard, ProForm, ProFormText, ProFormTextArea, ProFormSwitch, ProFormSelect, ProFormUploadButton } from "@ant-design/pro-components";
import { App, Divider, Typography } from "antd";

const { Title } = Typography;

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
            submitter={{ searchConfig: { submitText: "Lưu thay đổi", resetText: "Đặt lại" } }}
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
                rules={[{ required: true }, { type: "url", message: "URL không hợp lệ" }]}
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
            submitter={{ searchConfig: { submitText: "Lưu thay đổi", resetText: "Đặt lại" } }}
          >
            <ProForm.Group>
              <ProFormSelect
                name="moviesPerPage"
                label="Số phim mỗi trang"
                width="sm"
                options={["12", "24", "36", "48"].map((v) => ({ label: v, value: v }))}
              />
              <ProFormSelect
                name="defaultQuality"
                label="Chất lượng mặc định"
                width="sm"
                options={["SD", "HD", "Full HD", "4K"].map((v) => ({ label: v, value: v }))}
              />
            </ProForm.Group>
            <ProFormSwitch name="enableComments" label="Cho phép bình luận" />
            <ProFormSwitch name="requireApproval" label="Bình luận cần duyệt trước" />
            <ProFormSwitch name="enableWatermark" label="Thêm watermark vào ảnh thumbnail" />
          </ProForm>
        </ProCard>

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
              metaDescription: "MocPhim cung cấp kho phim online chất lượng HD, Vietsub cập nhật nhanh nhất",
              googleAnalyticsId: "",
            }}
            submitter={{ searchConfig: { submitText: "Lưu thay đổi", resetText: "Đặt lại" } }}
          >
            <ProFormText name="metaTitle" label="Meta Title" rules={[{ max: 60, message: "Tối đa 60 ký tự" }]} />
            <ProFormTextArea
              name="metaDescription"
              label="Meta Description"
              fieldProps={{ rows: 3 }}
              rules={[{ max: 160, message: "Tối đa 160 ký tự" }]}
            />
            <ProFormText name="googleAnalyticsId" label="Google Analytics ID" width="md" placeholder="G-XXXXXXXXXX" />
          </ProForm>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
