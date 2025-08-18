import React from "react";
import { useTranslation } from "react-i18next";

interface ActivityFilterProps {
  selectedActivityTypes: string[];
  onActivityTypeChange: (types: string[]) => void;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onDateRangeChange: (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  selectedActivityTypes,
  onActivityTypeChange,
  dateRange,
  onDateRangeChange,
}) => {
  const { t } = useTranslation("marketplace");
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const datePickerRef = React.useRef<HTMLDivElement>(null);

  const activityTypes = [
    { id: "all", label: t("activity_filter_all", "All Activity") },
    { id: "listing", label: t("activity_filter_listings", "Listings") },
    { id: "sale", label: t("activity_filter_sales", "Sales") },
    { id: "bid", label: t("activity_filter_bids", "Bids") },
    { id: "transfer", label: t("activity_filter_transfers", "Transfers") },
    { id: "like", label: t("activity_filter_likes", "Likes") },
  ];

  const handleActivityTypeClick = (typeId: string) => {
    if (typeId === "all") {
      onActivityTypeChange(["all"]);
    } else {
      const newTypes = selectedActivityTypes.includes(typeId)
        ? selectedActivityTypes.filter((type) => type !== typeId)
        : [...selectedActivityTypes.filter((type) => type !== "all"), typeId];

      // If no filters selected, default to "all"
      if (newTypes.length === 0) {
        onActivityTypeChange(["all"]);
      } else {
        onActivityTypeChange(newTypes);
      }
    }
  };

  const handleDateRangeToggle = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDateChange = (
    key: "startDate" | "endDate",
    value: Date | null,
  ) => {
    onDateRangeChange({
      ...dateRange,
      [key]: value,
    });
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  const handleClearDates = () => {
    onDateRangeChange({
      startDate: null,
      endDate: null,
    });
    setIsDatePickerOpen(false);
  };

  const handleApplyDates = () => {
    setIsDatePickerOpen(false);
  };

  // Handle clicking outside of date picker to close it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasDateFilter = dateRange.startDate || dateRange.endDate;

  return (
    <div className="activity-filter">
      <div className="activity-filter__types">
        {activityTypes.map((type) => (
          <button
            key={type.id}
            className={`activity-filter__type-btn ${
              selectedActivityTypes.includes(type.id)
                ? "activity-filter__type-btn--active"
                : ""
            }`}
            onClick={() => handleActivityTypeClick(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="activity-filter__date" ref={datePickerRef}>
        <button
          className={`activity-filter__date-btn ${hasDateFilter ? "activity-filter__date-btn--active" : ""}`}
          onClick={handleDateRangeToggle}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            {hasDateFilter
              ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
              : t("activity_filter_date_range", "Date Range")}
          </span>
        </button>

        {isDatePickerOpen && (
          <div className="activity-filter__date-picker">
            <div className="activity-filter__date-inputs">
              <div className="activity-filter__date-input-group">
                <label className="activity-filter__date-label">
                  {t("activity_filter_start_date", "Start Date")}
                </label>
                <input
                  type="date"
                  className="activity-filter__date-input"
                  value={
                    dateRange.startDate
                      ? dateRange.startDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    handleDateChange("startDate", date);
                  }}
                />
              </div>

              <div className="activity-filter__date-input-group">
                <label className="activity-filter__date-label">
                  {t("activity_filter_end_date", "End Date")}
                </label>
                <input
                  type="date"
                  className="activity-filter__date-input"
                  value={
                    dateRange.endDate
                      ? dateRange.endDate.toISOString().split("T")[0]
                      : ""
                  }
                  min={
                    dateRange.startDate
                      ? dateRange.startDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    handleDateChange("endDate", date);
                  }}
                />
              </div>
            </div>

            <div className="activity-filter__date-actions">
              <button
                className="activity-filter__date-clear"
                onClick={handleClearDates}
              >
                {t("activity_filter_clear", "Clear")}
              </button>
              <button
                className="activity-filter__date-apply"
                onClick={handleApplyDates}
              >
                {t("activity_filter_apply", "Apply")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFilter;
