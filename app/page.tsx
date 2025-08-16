"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  BadgeCheck,
  Gauge,
  RefreshCw,
  Play,
  Mail,
  MessageCircle,
  FileText,
  Linkedin,
  Youtube,
  Twitter,
  ChevronRight,
} from "lucide-react"
import Chart from "chart.js/auto"
import { cn } from "@/lib/utils"

export default function Page() {
  // Navbar scroll state
  const [scrolled, setScrolled] = useState(false)
  // Mobile menu
  const [mobileOpen, setMobileOpen] = useState(false)
  // Video overlay
  const [videoInteracted, setVideoInteracted] = useState(false)
  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [pixelUrl, setPixelUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Chart ref
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    // Restore video interaction state
    try {
      const v = localStorage.getItem("videoInteracted")
      if (v === "true") setVideoInteracted(true)
    } catch {}
  }, [])

  const handleVideoInteract = () => {
    setVideoInteracted(true)
    try {
      localStorage.setItem("videoInteracted", "true")
    } catch {}
  }

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setMobileOpen(false)
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: "smooth" })
  }

  // Initialize chart
  useEffect(() => {
    if (!chartCanvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    const ctx = chartCanvasRef.current.getContext("2d")
    if (!ctx) return

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["HRC 50", "HRC 55", "HRC 60", "HRC 65", "HRC 70"],
        datasets: [
          {
            label: "Competitor Carbide (minutes)",
            data: [25, 32, 45, 65, 90],
            borderColor: "#E94560",
            backgroundColor: "rgba(233, 69, 96, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Our Ceramic (minutes)",
            data: [8, 10, 15, 22, 30],
            borderColor: "#FF9800",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Cycle Time (minutes)" },
          },
          x: {
            title: { display: true, text: "Material Hardness (HRC)" },
          },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [])

  // Handle form submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const fd = new FormData(form)

    const name = String(fd.get("name") || "")
    const email = String(fd.get("email") || "")
    const phone = String(fd.get("phone") || "")
    const company = String(fd.get("company") || "")
    const requirements = String(fd.get("requirements") || "")

    const timestamp = new Date().toISOString()

    const u = new URL("https://pixeltrack-worker.laifa.xin/track/bzxN7N1R.jpeg")
    u.searchParams.set("e", email)
    u.searchParams.set("p", phone)
    u.searchParams.set("n", name)
    u.searchParams.set("m", requirements)
    u.searchParams.set("c1", company)
    setPixelUrl(u.toString())

    console.log("跟踪像素URL:", u.toString())

    setSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          requirements,
          timestamp,
        }),
      })

      if (!response.ok) {
        throw new Error("提交失败")
      }

      const result = await response.json()
      console.log("✅ 表单提交成功:", result.message)

      setShowModal(true)
      form.reset()

      // 跳转到感谢页面
      setTimeout(() => {
        window.location.href = "/thank-you"
      }, 2000)
    } catch (error) {
      console.error("提交错误:", error)

      const mailtoUrl = `mailto:linda@czqttools.com?subject=产品询盘 - ${name}&body=姓名: ${name}%0D%0A邮箱: ${email}%0D%0A电话: ${phone}%0D%0A公司: ${company}%0D%0A需求: ${requirements}%0D%0A提交时间: ${timestamp}`
      window.open(mailtoUrl, "_blank")

      setShowModal(true)
      form.reset()

      setTimeout(() => {
        window.location.href = "/thank-you"
      }, 2000)
    } finally {
      setSubmitting(false)
    }
  }

  // Styling tokens (no Tailwind config edit)
  const colors = useMemo(
    () => ({
      primary: "#0F3460",
      secondary: "#E94560",
      accent: "#FF9800",
      dark: "#1A1A2E",
      light: "#F5F5F7",
    }),
    [],
  )

  return (
    <main className="bg-white text-black">
      {/* Header */}
      <header id="navbar" className={cn("fixed top-0 z-50 w-full transition-all duration-300")}>
        <div
          className={cn(
            "container mx-auto px-4 flex items-center justify-between bg-white/90 backdrop-blur-sm",
            scrolled ? "py-2 shadow-md" : "py-3 shadow-sm",
          )}
        >
          <div className="flex items-center">
            <span className="font-bold text-2xl" style={{ color: colors.primary }}>
              QT TOOLS
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToId("specs")}
              className="font-medium text-gray-900 hover:text-[#FF9800] transition-colors"
              aria-label="Go to Specifications"
            >
              Specifications
            </button>
            <button
              onClick={() => scrollToId("cutting-data")}
              className="font-medium text-gray-900 hover:text-[#FF9800] transition-colors"
              aria-label="Go to Cutting Data"
            >
              Cutting Data
            </button>
            <button
              onClick={() => scrollToId("case-study")}
              className="font-medium text-gray-900 hover:text-[#FF9800] transition-colors"
              aria-label="Go to Case Study"
            >
              Case Study
            </button>
            <button
              onClick={() => scrollToId("why-choose")}
              className="font-medium text-gray-900 hover:text-[#FF9800] transition-colors"
              aria-label="Go to Why Choose Us"
            >
              Why Choose Us
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              className="hidden md:inline-flex font-semibold"
              style={{
                backgroundColor: colors.accent,
                color: "white",
              }}
              onClick={() => scrollToId("contact")}
            >
              Get Quote
            </Button>

            <button
              className="md:hidden text-xl text-gray-900"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle Menu"
            >
              <span className="sr-only">Open menu</span>
              {/* Simple burger */}
              <div className="space-y-1.5">
                <span className="block h-0.5 w-6 bg-gray-900"></span>
                <span className="block h-0.5 w-6 bg-gray-900"></span>
                <span className="block h-0.5 w-6 bg-gray-900"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-lg w-full">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
              <button
                onClick={() => scrollToId("specs")}
                className="py-2 text-left font-medium text-gray-900 hover:text-[#FF9800]"
              >
                Specifications
              </button>
              <button
                onClick={() => scrollToId("cutting-data")}
                className="py-2 text-left font-medium text-gray-900 hover:text-[#FF9800]"
              >
                Cutting Data
              </button>
              <button
                onClick={() => scrollToId("case-study")}
                className="py-2 text-left font-medium text-gray-900 hover:text-[#FF9800]"
              >
                Case Study
              </button>
              <button
                onClick={() => scrollToId("why-choose")}
                className="py-2 text-left font-medium text-gray-900 hover:text-[#FF9800]"
              >
                Why Choose Us
              </button>
              <Button
                onClick={() => scrollToId("contact")}
                className="mt-2 font-semibold"
                style={{ backgroundColor: colors.accent, color: "white" }}
              >
                Get Quote
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section
        className="pt-28 pb-16 md:pt-40 md:pb-24 text-white relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${colors.primary}, ${colors.dark})`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 z-10">
              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <BadgeCheck className="w-4 h-4 mr-2" /> ISO 9001 Certified
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <Gauge className="w-4 h-4 mr-2" /> For HRC55-70 Steel
                </span>
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" /> Longer Tool Life
                </span>
              </div>

              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-tight drop-shadow">
                Cut HRC60+ Hardened Steel <span style={{ color: colors.accent }}>5X Faster</span>
              </h1>
              <p className="text-[clamp(1.1rem,2vw,1.3rem)] text-white/80 mt-4 mb-8 max-w-xl">
                Drastically reduce cycle times and achieve superior surface finish. The expert&apos;s choice for mold &
                die machining.
              </p>

              <Button
                size="lg"
                className="font-bold text-lg shadow-lg"
                style={{ backgroundColor: colors.accent, color: "white" }}
                onClick={() => scrollToId("contact")}
              >
                Download Cutting Data & Get a Quote
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>

            {/* Video */}
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-video bg-black relative group">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={
                      "https://www.youtube.com/embed/FSgYrxPHL34?autoplay=1&mute=1&loop=1&playlist=FSgYrxPHL34&controls=0&modestbranding=1"
                    }
                    title="Ceramic end mill cutting demonstration"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {!videoInteracted && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center transition-opacity">
                      <button
                        onClick={handleVideoInteract}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: `${colors.accent}E6` }}
                        aria-label="Play video"
                      >
                        <Play className="w-8 h-8 md:w-10 md:h-10" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative blobs */}
              <div
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-2xl"
                style={{ backgroundColor: "rgba(255,152,0,0.2)" }}
                aria-hidden
              />
              <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl"
                style={{ backgroundColor: "rgba(15,52,96,0.3)" }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" aria-hidden>
          <svg
            preserveAspectRatio="none"
            width="100%"
            height="50"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0V95.8C59.71,118.92,165.07,111.31,321.39,56.44Z"
              fill={colors.light}
            />
          </svg>
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="py-16 md:py-24" style={{ backgroundColor: colors.light }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold mb-4" style={{ color: colors.primary }}>
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our premium ceramic end mills are engineered for extreme performance in hardened steel machining
              applications.
            </p>
          </div>

          {/* Technical parameters table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ backgroundColor: colors.primary, color: "white" }}>
                    <th className="px-6 py-4 font-semibold">Model No.</th>
                    <th className="px-6 py-4 font-semibold">Diameter</th>
                    <th className="px-6 py-4 font-semibold">Flutes</th>
                    <th className="px-6 py-4 font-semibold">Flute Length</th>
                    <th className="px-6 py-4 font-semibold">Overall Length</th>
                    <th className="px-6 py-4 font-semibold">Coating</th>
                    <th className="px-6 py-4 font-semibold">Recommended for Material</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["CEC-0602", "6mm", "2", "12mm", "50mm", "TiAlN", "HRC 55-62"],
                    ["CEC-1004", "10mm", "4", "25mm", "75mm", "TiAlN", "HRC 55-65"],
                    ["CEC-1204", "12mm", "4", "30mm", "90mm", "TiSiN", "HRC 60-68"],
                    ["CEC-1604", "16mm", "4", "40mm", "100mm", "TiSiN", "HRC 60-70"],
                    ["CEC-2004", "20mm", "4", "50mm", "120mm", "AlCrN", "HRC 58-65"],
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={cn("px-6 py-4", j === 0 ? "font-medium" : undefined)}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cutting data */}
          <div id="cutting-data" className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6" style={{ backgroundColor: colors.primary, color: "white" }}>
              <h3 className="text-xl font-bold mb-2">Ceramic End Mill Machining Case Studies</h3>
              <p className="text-white/80">Practical machining parameters for various materials and hardness levels</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    {[
                      "Specification",
                      "Material",
                      "Material Hardness (HRC)",
                      "Spindle Speed (RPM)",
                      "Feed Rate (mm/min)",
                      "Depth of Cut",
                      "Cooling Method",
                      "Machine Type",
                    ].map((h) => (
                      <th key={h} className="px-6 py-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["D10*75", "H13 Quenched", "50", "5000", "1500", "0.1", "Air Cooling", "Machining Center"],
                    ["D8*60", "H13 Quenched", "55", "6000", "2000", "0.1", "Air Cooling", "Machining Center"],
                    ["D12*75", "QT600-3", "35", "4500", "3000", "0.2", "Air Cooling", "Machining Center"],
                    ["D12*75", "P20", "30", "5000", "4000", "0.15", "Air Cooling", "Machining Center"],
                    ["D6*50", "P20 Quenched", "45", "7800", "2000", "0.1", "Air Cooling", "Engraving Machine"],
                    ["D4*50", "718", "40", "12000", "3000", "0.12", "Air Cooling", "Engraving Machine"],
                    ["D8*60", "H13 Quenched", "40", "7200", "3000", "0.1", "Air Cooling", "Engraving Machine"],
                    ["D6*50", "718", "32", "5000", "2500", "0.08", "Air Cooling", "Machining Center"],
                    ["D6*50", "S136 Quenched", "52", "8000", "3000", "0.08", "Air Cooling", "Engraving Machine"],
                    ["D2*50", "SKH-9", "60", "12000", "1000", "0.04", "Air Cooling", "Engraving Machine"],
                    ["D6*50", "D2", "52", "8000", "1000", "0.1", "Air Cooling", "Machining Center"],
                    ["D6*50", "S-STAR(A)", "54", "8000", "2000", "0.06", "Air Cooling", "Engraving Machine"],
                    ["D10*75*R0.5", "45# Steel", "30", "5000", "3000", "0.1", "Air Cooling", "Engraving Machine"],
                    ["D12*75", "H13 Quenched", "52", "6000", "1500", "0.1", "Air Cooling", "Machining Center"],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={cn("px-6 py-4", j === 0 ? "font-medium" : undefined)}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 text-sm text-gray-600 space-y-2">
              <p>
                The above are machining cases for common materials. Ceramic end mills can machine materials up to 65 HRC
                with mirror-like surface finish quality, and have a service life 3-5 times that of ordinary carbide end
                mills.
              </p>
              <p>
                Ceramic end mill machining follows these principles: high spindle speed, fast feed rate, and small
                cutting allowance. When increasing spindle speed, feed rate should also be increased. For larger cutting
                allowances, higher spindle speeds are required. Speeds must generally remain within the recommended
                parameter range - higher material hardness requires faster speeds, while lower hardness materials can
                use slower speeds within the recommended range.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case study */}
      <section id="case-study" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold mb-4" style={{ color: colors.primary }}>
              Case Study: Real-World Performance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how our ceramic end mills outperform traditional carbide tools in actual production environments.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
                Case Study: Machining an Injection Mold Core (Material: SKD11, HRC62)
              </h3>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Before: Traditional Carbide End Mill</h4>
                  <img
                    alt="Machining with traditional carbide end mill"
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                    src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/1f03d65ddf3e4ace8822de566e51ffc9~tplv-a9rns2rl98-image.image?rcl=2025081114102794D72A66CA0E9E94949B&amp;rk3s=8e244e95&amp;rrcfp=e75484ac&amp;x-expires=1755497427&amp;x-signature=DXpE1Oep%2B2U2Gjk6RfJ2aDmwACs%3D"
                  />
                  <p className="text-gray-600">
                    Long cycle times and frequent tool changes increased production costs and reduced throughput.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
                    After: Our Ceramic End Mill
                  </h4>
                  <img
                    alt="Machining with our ceramic end mill"
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                    src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/927e68e9cd5e4aabbb3abbeabe702075~tplv-a9rns2rl98-image.image?rcl=20250811141136D9C586C90EB866DD936A&amp;rk3s=8e244e95&amp;rrcfp=e75484ac&amp;x-expires=1755497496&amp;x-signature=Mo4twgjm9rx670wlsPq87mzLuiw%3D"
                  />
                  <p className="text-gray-600">
                    Dramatically faster cutting speeds with superior surface finish and extended tool life.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      {["Parameter", "Competitor's Carbide End Mill", "Our Ceramic End Mill", "Improvement"].map(
                        (h) => (
                          <th key={h} className="px-6 py-4 font-semibold">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      ["Cycle Time", "45 minutes", "15 minutes", "-66%"],
                      ["Operating RPM", "3,500", "12,000", "+243%"],
                      ["Tool Life", "2 pieces", "8 pieces", "+300%"],
                      ["Surface Finish (Ra)", "0.8 μm", "0.4 μm", "Superior"],
                      ["Cost per Part", "$5.20", "$2.80", "-46%"],
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{row[0]}</td>
                        <td className="px-6 py-4">{row[1]}</td>
                        <td className="px-6 py-4">{row[2]}</td>
                        <td className="px-6 py-4 font-semibold" style={{ color: colors.accent }}>
                          {row[3]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
              Performance Comparison: Cycle Time vs. Material Hardness
            </h3>
            <div className="h-80">
              <canvas ref={chartCanvasRef} aria-label="Performance chart" role="img"></canvas>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why-choose" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold mb-4" style={{ color: colors.primary }}>
              Why Choose Our Ceramic End Mills
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We&apos;re committed to providing the highest quality cutting tools backed by exceptional service and
              technical expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Direct Manufacturer",
                desc: "Eliminate middlemen and get competitive pricing with factory-direct supply. Custom solutions available.",
                iconBg: "rgba(15,52,96,0.1)",
              },
              {
                title: "Strict Quality Control",
                desc: "Every tool undergoes 100% inspection to ensure consistent performance and dimensional accuracy.",
                iconBg: "rgba(15,52,96,0.1)",
              },
              {
                title: "Global Support",
                desc: "Fast worldwide shipping and responsive technical support to keep your production running smoothly.",
                iconBg: "rgba(15,52,96,0.1)",
              },
              {
                title: "Technical Consultation",
                desc: "Free expert advice to optimize your machining processes and select the perfect tool for your application.",
                iconBg: "rgba(15,52,96,0.1)",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-6 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
                style={{ backgroundColor: colors.light }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: item.iconBg }}
                >
                  {/* Icon swap by index */}
                  {i === 0 ? (
                    <BadgeCheck style={{ color: colors.primary }} className="w-7 h-7" />
                  ) : i === 1 ? (
                    <RefreshCw style={{ color: colors.primary }} className="w-7 h-7" />
                  ) : i === 2 ? (
                    <Youtube style={{ color: colors.primary }} className="w-7 h-7" />
                  ) : (
                    <MessageCircle style={{ color: colors.primary }} className="w-7 h-7" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-16 md:py-24 text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${colors.primary}, ${colors.dark})`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Ready to reduce cycle times and lower production costs? Contact us for a custom quote and technical
              support.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Form */}
            <div className="md:col-span-3 bg-white rounded-xl shadow-xl p-6 md:p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
                Get a Custom Quote & Free Technical Support
              </h3>
              <p className="text-gray-600 mb-6">
                {
                  "Tell us your application (material, hardness, etc.), and our engineers will recommend the best solution and provide a quote within 24 hours."
                }
              </p>
              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF9800]/20 focus:border-[#FF9800]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Company Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF9800]/20 focus:border-[#FF9800]"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF9800]/20 focus:border-[#FF9800]"
                    placeholder="+86 139xxxxxxx"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    id="company"
                    name="company"
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF9800]/20 focus:border-[#FF9800]"
                    placeholder="Company Inc."
                  />
                </div>
                <div>
                  <label htmlFor="requirements" className="block text-gray-700 font-medium mb-2">
                    Your Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF9800]/20 focus:border-[#FF9800]"
                    placeholder="e.g. Need 10mm 4-flute for HRC62 D2 steel, please quote 50pcs."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-bold text-lg"
                  disabled={submitting}
                  style={{ backgroundColor: colors.accent, color: "white" }}
                >
                  {submitting ? "Sending..." : "Send My Request"}
                </Button>
              </form>
            </div>

            {/* Contact Card */}
            <div className="md:col-span-2">
              <div className="rounded-xl p-6 md:p-8 h-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                <h3 className="text-2xl font-bold mb-6">Contact Us Directly</h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0"
                      style={{ backgroundColor: "rgba(255,152,0,0.2)" }}
                    >
                      <Mail className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Email Us</h4>
                      <p className="text-white/80">Our technical team will respond within 24 hours.</p>
                      <a
                        href="mailto:Linda@czqttools.com"
                        className="mt-1 inline-block"
                        style={{ color: colors.accent }}
                      >
                        Linda@czqttools.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0"
                      style={{ backgroundColor: "rgba(255,152,0,0.2)" }}
                    >
                      <MessageCircle className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">WhatsApp</h4>
                      <p className="text-white/80">Chat directly with our engineers.</p>
                      <a
                        href="https://wa.me/8613915092693"
                        className="mt-1 inline-flex items-center"
                        style={{ color: colors.accent }}
                      >
                        +86 13915092693
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0"
                      style={{ backgroundColor: "rgba(255,152,0,0.2)" }}
                    >
                      <FileText className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Download Resources</h4>
                      <p className="text-white/80">Technical brochures and catalogs.</p>
                      <a href="#" className="mt-1 inline-flex items-center" style={{ color: colors.accent }}>
                        Download Catalog <ChevronRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/20">
                  <h4 className="font-semibold text-lg mb-4">Our Commitment</h4>
                  <p className="text-white/80 mb-4">
                    We provide free samples for qualified applications. Contact us to see if your machining process is a
                    good fit for our ceramic end mills.
                  </p>
                  <Button
                    className="font-semibold"
                    variant="secondary"
                    onClick={() => scrollToId("contact")}
                    style={{ backgroundColor: "white", color: colors.primary }}
                  >
                    Request Sample
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal via shadcn Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2" style={{ color: colors.primary }}>
                <BadgeCheck className="text-green-500" /> Request Submitted!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Our technical team will contact you within 24 hours with your custom quote and cutting data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => setModalOpen(false)} style={{ backgroundColor: colors.accent, color: "white" }}>
                Close
              </Button>
            </div>
            {pixelUrl && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                <p>跟踪像素已加载 ✓</p>
                <img
                  src={pixelUrl || "/placeholder.svg"}
                  alt="submission-tracking"
                  width={1}
                  height={1}
                  className="inline-block"
                  onLoad={() => console.log("跟踪像素图片加载成功")}
                  onError={() => console.log("跟踪像素图片加载失败")}
                />
                <details className="mt-1">
                  <summary className="cursor-pointer">查看跟踪URL</summary>
                  <p className="mt-1 break-all text-xs">{pixelUrl}</p>
                </details>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: colors.dark, color: "rgba(255,255,255,0.8)" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold text-xl mb-4">CeramicPro</h4>
              <p className="mb-4">
                The ultimate ceramic end mills for high-speed hard milling applications. Trusted by manufacturing
                professionals worldwide.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/linda-jiang-674190199/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF9800] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-[#FF9800] transition-colors" aria-label="YouTube">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-[#FF9800] transition-colors" aria-label="Twitter">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Products</h4>
              <ul className="space-y-2">
                {["Ceramic End Mills", "Carbide end mills", "PCD Tools", "Custom Solutions"].map((t) => (
                  <li key={t}>
                    <a href="#" className="hover:text-[#FF9800] transition-colors">
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Technical Data", "Case Studies", "Machining Guide", "Blog"].map((t) => (
                  <li key={t}>
                    <a href="#" className="hover:text-[#FF9800] transition-colors">
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                {["About Us", "Quality Control", "Careers"].map((t) => (
                  <li key={t}>
                    <a href="#" className="hover:text-[#FF9800] transition-colors">
                      {t}
                    </a>
                  </li>
                ))}
                <li>
                  <button onClick={() => scrollToId("contact")} className="hover:text-[#FF9800] transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 CeramicPro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#FF9800] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#FF9800] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#FF9800] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
