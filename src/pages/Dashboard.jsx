/**
 * src/pages/Dashboard.jsx
 * Bản ghi đè mở rộng khung Moniq để modal đăng nhập không bị chèn.
 */
import React from "react";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1720px] px-4 py-8">
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-xl border border-white/10 bg-[#0b1220]/70 shadow-xl backdrop-blur-md p-3">
          <header className="flex items-center justify-between pb-3">
            <div className="text-lg font-semibold tracking-wide">
              <span className="text-white/80">TOOL</span>
              <span className="text-[#8b7cf6] ml-1">MONIQ</span>
            </div>
            <button
              className="rounded-md bg-rose-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500"
              onClick={() => window.location.assign("/auth")}
            >
              Đăng xuất
            </button>
          </header>
          <div className="moniq-wrap relative">
            <iframe
              title="Moniq"
              src={import.meta.env.VITE_MONIQ_CHART_URL}
              className="moniq-frame w-full min-h-[78vh] rounded-lg border-0 shadow-inner pointer-events-auto z-[1] block"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              allow="clipboard-write; fullscreen; autoplay; payment *"
            />
          </div>
        </section>

        <aside className="rounded-xl border border-white/10 bg-[#0b1220]/70 shadow-xl backdrop-blur-md p-4 2xl:sticky 2xl:top-6">
          <h3 className="text-cyan-300 text-xl font-bold mb-3">Dự đoán cây nến kế tiếp</h3>
          <div className="text-white/70 text-sm">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-xs text-white/50">Đã đúng</div>
                <div className="text-xl font-semibold">— / —</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-xs text-white/50">Tỷ lệ đúng</div>
                <div className="text-xl font-semibold">—%</div>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              * Panel tạm. Khi có dữ liệu Moniq (WS/HTTP) sẽ cập nhật BUY/SELL & thống kê.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
