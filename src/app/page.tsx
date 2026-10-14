import TowerApp from "@/components/TowerApp";
import { directoryOrder, floorLabel, itemsOfFloor } from "@/lib/building";

export default function Home() {
  return (
    <>
      <TowerApp />
      {/* Static directory for no-JS visitors and crawlers */}
      <noscript>
        <main className="directory-page">
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
            <h1 className="text-2xl font-bold">iSETH 포트폴리오 타워</h1>
            {directoryOrder.map((f) => (
              <section key={f.id}>
                <h2 className="text-lg font-bold">
                  {floorLabel(f)} {f.name}
                </h2>
                <p>{f.description}</p>
                <ul>
                  {itemsOfFloor(f.id).map((i) => (
                    <li key={i.id}>
                      {i.title} — {i.description}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </noscript>
    </>
  );
}
