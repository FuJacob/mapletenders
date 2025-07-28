import { memo, useState, useEffect } from "react";
import { TrendUp, DollarSign, Clock, Trophy, Calculator } from "@phosphor-icons/react";
import { analyticsAPI, type ROIMetrics, type TimeSavingsData } from "../../api/analytics";

interface ROICalculatorProps {
  className?: string;
}

const ROICalculator = memo(function ROICalculator({ className = "" }: ROICalculatorProps) {
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [roiData, setROIData] = useState<ROIMetrics | null>(null);
  const [timeSavingsData, setTimeSavingsData] = useState<TimeSavingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [roiResponse, timeSavingsResponse] = await Promise.all([
        analyticsAPI.getROI(timeFrame),
        analyticsAPI.getTimeSavings(timeFrame)
      ]);
      
      setROIData(roiResponse);
      setTimeSavingsData(timeSavingsResponse);
    } catch (err) {
      console.error('Error fetching ROI data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load ROI data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeFrame]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatHours = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours.toFixed(1)} hours`;
  };

  const getROIColor = (percentage: number) => {
    if (percentage >= 1000) return "text-success";
    if (percentage >= 500) return "text-info";
    if (percentage >= 200) return "text-warning";
    return "text-text";
  };

  const getROIDescription = (percentage: number) => {
    if (percentage >= 1000) return "Exceptional Return";
    if (percentage >= 500) return "Excellent Return";
    if (percentage >= 200) return "Good Return";
    if (percentage >= 100) return "Positive Return";
    return "Building Value";
  };

  if (loading) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text mb-2">ROI Calculator</h3>
          <p className="text-error text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roiData || !timeSavingsData) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text mb-2">ROI Calculator</h3>
          <p className="text-text-light text-sm">No data available yet</p>
          <p className="text-text-light text-xs mt-1">Start using the platform to see your ROI</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <Calculator className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">ROI Calculator</h3>
              <p className="text-sm text-text-light">Return on Investment Analysis</p>
            </div>
          </div>
          
          {/* Time Frame Selector */}
          <div className="flex bg-surface-muted rounded-lg p-1">
            {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeFrame === period
                    ? 'bg-primary text-white'
                    : 'text-text-light hover:text-text'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total ROI */}
          <div className="text-center">
            <div className="bg-success/10 p-3 rounded-lg mb-2 mx-auto w-fit">
              <TrendUp className="w-6 h-6 text-success" />
            </div>
            <h4 className={`text-2xl font-bold ${getROIColor(roiData.roiPercentage)}`}>
              {roiData.roiPercentage.toFixed(0)}%
            </h4>
            <p className="text-sm text-text">Total ROI</p>
            <p className="text-xs text-text-light">{getROIDescription(roiData.roiPercentage)}</p>
          </div>

          {/* Total Return */}
          <div className="text-center">
            <div className="bg-primary/10 p-3 rounded-lg mb-2 mx-auto w-fit">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-2xl font-bold text-text">
              {formatCurrency(roiData.totalReturn)}
            </h4>
            <p className="text-sm text-text">Total Return</p>
            <p className="text-xs text-text-light">Value generated</p>
          </div>

          {/* Time Saved */}
          <div className="text-center">
            <div className="bg-info/10 p-3 rounded-lg mb-2 mx-auto w-fit">
              <Clock className="w-6 h-6 text-info" />
            </div>
            <h4 className="text-2xl font-bold text-text">
              {formatHours(timeSavingsData.timeSavedHours)}
            </h4>
            <p className="text-sm text-text">Time Saved</p>
            <p className="text-xs text-text-light">vs manual search</p>
          </div>

          {/* Contracts Won */}
          <div className="text-center">
            <div className="bg-warning/10 p-3 rounded-lg mb-2 mx-auto w-fit">
              <Trophy className="w-6 h-6 text-warning" />
            </div>
            <h4 className="text-2xl font-bold text-text">
              {roiData.contractsWon}
            </h4>
            <p className="text-sm text-text">Contracts Won</p>
            <p className="text-xs text-text-light">{formatCurrency(roiData.contractsWonValue)}</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-surface-muted rounded-lg p-4">
          <h4 className="font-semibold text-text mb-3">ROI Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-light">Investment (Subscription):</span>
              <span className="font-medium text-text">{formatCurrency(roiData.totalInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-light">Contracts Value:</span>
              <span className="font-medium text-text">{formatCurrency(roiData.contractsWonValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-light">Time Savings Value:</span>
              <span className="font-medium text-text">{formatCurrency(timeSavingsData.moneySavedCAD)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="text-text font-medium">Net Return:</span>
              <span className="font-bold text-success">
                {formatCurrency(roiData.totalReturn - roiData.totalInvestment)}
              </span>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="mt-4 bg-info/5 rounded-lg p-4">
          <h4 className="font-semibold text-text mb-2">Efficiency Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-light">Opportunities Viewed:</span>
              <div className="font-medium text-text">{timeSavingsData.opportunitiesViewed}</div>
            </div>
            <div>
              <span className="text-text-light">Efficiency Gain:</span>
              <div className="font-medium text-success">
                {timeSavingsData.efficiencyPercentage.toFixed(0)}% faster
              </div>
            </div>
            <div>
              <span className="text-text-light">Manual Time Required:</span>
              <div className="font-medium text-text">
                {formatHours(timeSavingsData.manualSearchTimeRequired)}
              </div>
            </div>
            <div>
              <span className="text-text-light">Platform Time Used:</span>
              <div className="font-medium text-text">
                {formatHours(timeSavingsData.actualTimeSpent)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ROICalculator;