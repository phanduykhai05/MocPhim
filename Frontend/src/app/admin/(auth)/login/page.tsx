"use client";

import React, { useEffect } from "react";
import { LoginFormPage, ProFormText } from "@ant-design/pro-components";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ConfigProvider, App } from "antd";
import { useRouter } from "next/navigation";
import viVN from "antd/locale/vi_VN";
import images from "@/assets/images";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

function LoginPageContent() {
  const { message: msg } = App.useApp();
  const router = useRouter();
  const { login, logout, user, isLoading } = useAuth();

  // Đã đăng nhập là admin → vào thẳng dashboard
  useEffect(() => {
    if (!isLoading && user?.roles.includes("ROLE_ADMIN")) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, user, router]);

  const handleFinish = async (values: Record<string, string>) => {
    const { email, password } = values;

    let me;
    try {
      // login() gọi API, lưu token VÀ cập nhật AuthContext state
      me = await login(email, password);
    } catch (err: unknown) {
      msg.error(err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng!");
      return false;
    }

    // Kiểm tra role từ user trả về (đã được xác thực qua /auth/me)
    if (!me.roles.includes("ROLE_ADMIN")) {
      msg.error("Tài khoản này không có quyền truy cập trang quản trị!");
      logout(); // xóa token + reset state
      return false;
    }

    msg.success("Đăng nhập thành công!");
    router.replace("/admin/dashboard");
    return true;
  };

  return (
    <div style={{ height: "100vh" }}>
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        logo={
          <Image
            src={images.logo}
            alt="MocPhim"
            width={48}
            height={48}
            style={{ borderRadius: 8 }}
          />
        }
        title="MocPhim"
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(4px)",
        }}
        subTitle="Hệ thống quản trị — Chỉ dành cho Admin"
        onFinish={handleFinish}
      >
        <ProFormText
          name="email"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined style={{ color: "rgba(0,0,0,0.25)" }} />,
          }}
          placeholder="Email quản trị viên"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />,
          }}
          placeholder="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        />
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

