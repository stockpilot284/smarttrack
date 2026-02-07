export default function ProductValuePanel() {
  return (
    <section
      className="hidden lg:flex flex-1 flex-col bg-primary px-16 "
      id="product-value-panel"
    >
      {/* Title & Login CTA */}
      <div className="pt-20 flex flex-col gap-1.5">
        <h2 className="text-2xl font-medium  text-white">
          Track deliveries. Stay in control.
        </h2>
        <h3 className="text-sm text-[#E4D6E4] font-normal">
          Manage deliveries, drivers, and vehicles in one dashboard.
        </h3>
      </div>

      {/** Dashboard Image */}
      <div className="w-full h-fit">
        <img
          src="/assets/images/dashboard.png"
          alt="Product Value Panel Dashboard"
          className=" w-full h-full object-contain"
        />
      </div>
    </section>
  )
}
