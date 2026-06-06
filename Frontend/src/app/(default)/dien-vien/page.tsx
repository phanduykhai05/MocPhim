import { Suspense } from "react";
import ActorsClient from "./ActorsClient";

export const metadata = { title: "Diễn Viên | MócPhim" };

export default function ActorsPage() {
  return (
    <Suspense>
      <ActorsClient />
    </Suspense>
  );
}
