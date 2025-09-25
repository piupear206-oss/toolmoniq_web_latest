/**
 * src/pages/Dashboard.jsx (BẢN TO HƠN)
 * - iFrame Moniq chiếm gần full màn hình, rất cao để modal không bị kẹt.
 * - Khi < 2xl: 1 cột (panel rớt xuống). Khi ≥ 2xl: chart cực lớn + panel 380px.
 */
import React from "react";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1920px] px-3 py-6">
      {/* 1 cột mặc định; 2 cột khi rất rộng */}
      <div className="grid grid-cols-1 gap-8 2xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* CHART */}
        <section className="rounded-xl border border-white/10 bg-[#0b1220]/70 shadow-xl backdrop-blur-md p-4">
          <header className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-semibold tracking-wide">
              <span className="text-white/80">TOOL</span>
              <span className="text-[#8b7cf6] ml-1">MONIQ</span>
            </h2>
            <button
              className="rounded-md bg-rose-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500"
              onClick={() => window.location.assign("/auth")}
            >
              Đăng xuất
            </button>
          </header>

          {/* IFRAME TO & CAO */}
          <div className="moniq-wrap relative">
            <iframe
              title="Moniq"
              src={import.meta.env.VITE_MONIQ_CHART_URL}
              className="moniq-frame block w-full h-[calc(100vh-140px)] min-h-[88vh] rounded-lg border-0 shadow-inner pointer-events-auto z-[1]"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              allow="clipboard-write; fullscreen; autoplay; payment *"
            />
          </div>
        </section>

        {/* PANEL */}
        <aside className="rounded-xl border border-white/10 bg-[#0b1220]/70 shadow-xl backdrop-blur-md p-5 2xl:sticky 2xl:top-6">
          <h3 className="text-cyan-300 text-2xl font-bold mb-4">Dự đoán cây nến kế tiếp</h3>
          <div className="text-white/80 text-base space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/5 p-4">
                <div className="text-xs text-white/50">Đã đúng</div>
                <div className="text-2xl font-semibold">— / —</div>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <div className="text-xs text-white/50">Tỷ lệ đúng</div>
                <div className="text-2xl font-semibold">—%</div>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-4 leading-relaxed">
              * Panel tạm. Khi có dữ liệu Moniq (WS/HTTP) sẽ cập nhật BUY/SELL & thống kê.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
