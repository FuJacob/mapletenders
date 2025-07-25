import { useState, useEffect } from "react";
import {
  ChartBar,
  TrendUp,
  Target,
  Clock,
  Users,
  CurrencyDollar,
  MapPin,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  Bookmark,
  Download,
} from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";

// Mock data types
interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

interface TopPerformingCategory {
  category: string;
  matches: number;
  winRate: number;
  avgValue: string;
}

interface RegionalData {
  province: string;
  opportunities: number;
  totalValue: string;
  winRate: number;
}

interface MonthlyTrend {
  month: string;
  opportunities: number;
  applications: number;
  wins: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );
  const [loading, setLoading] = useState(true);

  // Mock analytics data
  const [analyticsData] = useState({
    keyMetrics: [
      {
        label: "Total Opportunities Viewed",
        value: "1,247",
        change: 12.5,
        changeLabel: "vs last month",
        icon: <Eye className="w-6 h-6" />,
        color: "text-info",
      },
      {
        label: "Bookmarked Tenders",
        value: "89",
        change: 8.3,
        changeLabel: "vs last month",
        icon: <Bookmark className="w-6 h-6" />,
        color: "text-primary",
      },
      {
        label: "Match Score Average",
        value: "87%",
        change: 5.2,
        changeLabel: "vs last month",
        icon: <Target className="w-6 h-6" />,
        color: "text-success",
      },
      {
        label: "Response Rate",
        value: "34%",
        change: -2.1,
        changeLabel: "vs last month",
        icon: <TrendUp className="w-6 h-6" />,
        color: "text-warning",
      },
    ] as AnalyticsMetric[],
    topCategories: [
      {
        category: "IT & Software Development",
        matches: 156,
        winRate: 24,
        avgValue: "$450K",
      },
      {
        category: "Professional Services",
        matches: 89,
        winRate: 31,
        avgValue: "$280K",
      },
      {
        category: "Construction & Engineering",
        matches: 67,
        winRate: 18,
        avgValue: "$1.2M",
      },
      {
        category: "Healthcare Services",
        matches: 45,
        winRate: 28,
        avgValue: "$320K",
      },
    ] as TopPerformingCategory[],
    regionalData: [
      {
        province: "Ontario",
        opportunities: 423,
        totalValue: "$12.8M",
        winRate: 26,
      },
      {
        province: "British Columbia",
        opportunities: 267,
        totalValue: "$8.4M",
        winRate: 22,
      },
      {
        province: "Quebec",
        opportunities: 198,
        totalValue: "$6.2M",
        winRate: 29,
      },
      {
        province: "Alberta",
        opportunities: 145,
        totalValue: "$4.1M",
        winRate: 24,
      },
      {
        province: "Manitoba",
        opportunities: 89,
        totalValue: "$2.8M",
        winRate: 31,
      },
    ] as RegionalData[],
    monthlyTrends: [
      { month: "Aug", opportunities: 245, applications: 23, wins: 7 },
      { month: "Sep", opportunities: 312, applications: 31, wins: 9 },
      { month: "Oct", opportunities: 289, applications: 28, wins: 8 },
      { month: "Nov", opportunities: 367, applications: 35, wins: 11 },
      { month: "Dec", opportunities: 334, applications: 32, wins: 10 },
      { month: "Jan", opportunities: 298, applications: 29, wins: 9 },
    ] as MonthlyTrend[],
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const handleTimeRangeChange = (range: "7d" | "30d" | "90d" | "1y") => {
    setTimeRange(range);
    setLoading(true);
    // In a real app, this would trigger a new data fetch
  };

  const handleExportReport = () => {
    // Mock export functionality
    console.log("Exporting analytics report...");
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <PageHeader
          icon={<ChartBar className="w-10 h-10 text-primary" />}
          title="Analytics"
          description="Track your procurement performance and insights"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ChartBar className="w-12 h-12 text-text-muted mx-auto mb-4 animate-pulse" />
            <p className="text-text-muted">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            icon={<ChartBar className="w-10 h-10 text-primary" />}
            title="Analytics"
            description="Track your procurement performance and insights"
          />

          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex bg-surface border border-border rounded-lg p-1">
              {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    timeRange === range
                      ? "bg-primary text-white"
                      : "text-text hover:bg-border"
                  }`}
                >
                  {range === "7d" && "7 Days"}
                  {range === "30d" && "30 Days"}
                  {range === "90d" && "90 Days"}
                  {range === "1y" && "1 Year"}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.keyMetrics.map((metric, index) => (
              <div
                key={index}
                className="bg-surface border border-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`${metric.color} bg-current/10 p-3 rounded-lg`}
                  >
                    <div className={metric.color}>{metric.icon}</div>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      metric.change >= 0 ? "text-success" : "text-error"
                    }`}
                  >
                    {metric.change >= 0 ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm text-text-muted">{metric.label}</p>
                <p className="text-xs text-text-light mt-1">
                  {metric.changeLabel}
                </p>
              </div>
            ))}
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Trends */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
                <TrendUp className="w-5 h-5 text-primary" />
                Monthly Performance Trends
              </h3>
              <div className="space-y-4">
                {analyticsData.monthlyTrends.map((month, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center">
                        <span className="text-sm font-medium text-text">
                          {month.month}
                        </span>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-sm">
                          <span className="text-text-muted">
                            Opportunities:
                          </span>
                          <span className="font-medium text-text ml-1">
                            {month.opportunities}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-text-muted">Applied:</span>
                          <span className="font-medium text-text ml-1">
                            {month.applications}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-text-muted">Won:</span>
                          <span className="font-medium text-success ml-1">
                            {month.wins}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-text">
                        {Math.round((month.wins / month.applications) * 100)}%
                        Win Rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Categories */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Top Performing Categories
              </h3>
              <div className="space-y-4">
                {analyticsData.topCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  >
                    <div>
                      <h4 className="font-medium text-text">
                        {category.category}
                      </h4>
                      <p className="text-sm text-text-muted">
                        {category.matches} opportunities matched
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-text">
                        {category.avgValue} avg
                      </div>
                      <div
                        className={`text-sm ${
                          category.winRate >= 25
                            ? "text-success"
                            : category.winRate >= 20
                            ? "text-warning"
                            : "text-text-muted"
                        }`}
                      >
                        {category.winRate}% win rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Performance */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Regional Performance Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-text">
                      Province
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text">
                      Opportunities
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text">
                      Total Value
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text">
                      Win Rate
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-text">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.regionalData.map((region, index) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 hover:bg-surface-muted"
                    >
                      <td className="py-3 px-4 font-medium text-text">
                        {region.province}
                      </td>
                      <td className="py-3 px-4 text-text-muted">
                        {region.opportunities}
                      </td>
                      <td className="py-3 px-4 text-text-muted">
                        {region.totalValue}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm ${
                            region.winRate >= 25
                              ? "text-success"
                              : region.winRate >= 20
                              ? "text-warning"
                              : "text-text-muted"
                          }`}
                        >
                          {region.winRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {region.winRate >= 25 ? (
                          <span className="px-2 py-1 bg-success/10 text-success rounded text-xs font-medium">
                            Excellent
                          </span>
                        ) : region.winRate >= 20 ? (
                          <span className="px-2 py-1 bg-warning/10 text-warning rounded text-xs font-medium">
                            Good
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-text-muted/10 text-text-muted rounded text-xs font-medium">
                            Average
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              AI-Powered Insights & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text mb-1">
                      Strong IT Performance
                    </h4>
                    <p className="text-sm text-text-muted">
                      Your IT & Software Development category shows 24% win
                      rate, above industry average. Consider focusing more
                      resources here.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <Clock className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text mb-1">
                      Improve Response Time
                    </h4>
                    <p className="text-sm text-text-muted">
                      Your response rate decreased by 2.1% this month. Consider
                      setting up alerts for high-match opportunities.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-info/5 border border-info/20 rounded-lg">
                  <TrendUp className="w-5 h-5 text-info mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text mb-1">
                      Quebec Opportunity
                    </h4>
                    <p className="text-sm text-text-muted">
                      Quebec shows your highest win rate at 29%. Consider
                      expanding your presence in this region.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-maple/5 border border-maple/20 rounded-lg">
                  <CurrencyDollar className="w-5 h-5 text-maple mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text mb-1">
                      Contract Value Growth
                    </h4>
                    <p className="text-sm text-text-muted">
                      Your average contract values increased 15% this quarter.
                      Focus on higher-value opportunities to maximize ROI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
