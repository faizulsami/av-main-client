export default function MissionSection() {
  return (
    <section className="w-full">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet">
          Our Mission
        </h2>

        <div className="flex flex-col items-center rounded-xl overflow-hidden text-center bg-soft-paste-light-hover p-4 gap-4 max-w-4xl mx-auto">
          <div className="prose prose-lg text-muted-foreground text-md h-full w-full">
            <p>
            To provide a safe, anonymous platform where individuals can freely express their emotions, where every emotion is validated, and sharing becomes a step toward emotional well-being.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
