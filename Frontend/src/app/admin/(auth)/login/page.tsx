"use client";

import React, { useState } from "react";
import { LoginFormPage, ProFormText, ProFormCheckbox } from "@ant-design/pro-components";
import { LockOutlined, UserOutlined, MobileOutlined } from "@ant-design/icons";
import { ConfigProvider, Tabs, message, App, Divider, Space } from "antd";
import { useRouter } from "next/navigation";
import viVN from "antd/locale/vi_VN";
import images from "@/assets/images";
import Image from "next/image";

type LoginType = "account" | "phone";

function LoginPageContent() {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const { message: msg } = App.useApp();
  const router = useRouter();

  return (
    <div style={{ height: "100vh" }}>
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        logo={<Image src={images.logo} alt="MocPhim" width={48} height={48} style={{ borderRadius: 8 }} />}
        title="MocPhim"
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(4px)",
        }}
        subTitle="Hệ thống quản trị MocPhim"
        actionsRender={(props) => {
          if (props.collapsed) return [];
          return [
            <div
              key="divider"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Divider plain style={{ color: "rgba(255,255,255,0.65)" }}>
                <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: "normal", fontSize: 14 }}>
                  Hoặc đăng nhập với
                </span>
              </Divider>
              <Space size={24} style={{ justifyContent: "center" }}>
                {["github", "google"].map((provider) => (
                  <div
                    key={provider}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      height: 40,
                      width: 40,
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                      cursor: "pointer",
                      color: "white",
                      fontSize: 20,
                    }}
                  >
                    {provider === "github" ? "G" : "g"}
                  </div>
                ))}
              </Space>
            </div>,
          ];
        }}
        onFinish={async (values) => {
          // Mock login: admin/admin123
          if (values.username === "admin" && values.password === "admin123") {
            msg.success("Đăng nhập thành công!");
            router.push("/admin/dashboard");
          } else {
            msg.error("Tên đăng nhập hoặc mật khẩu không đúng!");
          }
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(key) => setLoginType(key as LoginType)}
          style={{ color: "rgba(255,255,255,0.85)" }}
          items={[
            { key: "account", label: <span style={{ color: loginType === "account" ? "#1677ff" : "rgba(255,255,255,0.65)" }}>Tài khoản</span> },
            { key: "phone", label: <span style={{ color: loginType === "phone" ? "#1677ff" : "rgba(255,255,255,0.65)" }}>Số điện thoại</span> },
          ]}
        />

        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined style={{ color: "rgba(0,0,0,0.25)" }} />,
              }}
              placeholder="Tài khoản: admin"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />,
              }}
              placeholder="Mật khẩu: admin123"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            />
          </>
        )}

        {loginType === "phone" && (
          <>
            <ProFormText
              name="phone"
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined style={{ color: "rgba(0,0,0,0.25)" }} />,
              }}
              placeholder="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
              ]}
            />
            <ProFormText
              name="captcha"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />,
              }}
              placeholder="Mã xác thực"
              rules={[{ required: true, message: "Vui lòng nhập mã xác thực!" }]}
            />
          </>
        )}

        <div style={{ marginBlockEnd: 24, color: "rgba(255,255,255,0.85)" }}>
          <ProFormCheckbox noStyle name="autoLogin">
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Tự động đăng nhập</span>
          </ProFormCheckbox>
          <a style={{ float: "right", color: "#1677ff" }} href="#">
            Quên mật khẩu?
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ConfigProvider locale={viVN}>
      <App>
        <LoginPageContent />
      </App>
    </ConfigProvider>
  );
}
