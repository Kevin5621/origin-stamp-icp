import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Bell,
  X,
  Check,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  isRead: boolean;
}

interface NotificationButtonProps {
  className?: string;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  className = "",
}) => {
  const { t } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to IC Vibe!",
      message:
        "Thank you for joining our platform. Start exploring your dashboard.",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
    },
    {
      id: "2",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
    },
    {
      id: "3",
      title: "New Feature Available",
      message: "Check out our new 3D model viewer feature in the dashboard.",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false,
    },
    {
      id: "4",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight at 2 AM UTC.",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      isRead: false,
    },
    {
      id: "5",
      title: "Security Alert",
      message: "New login detected from unknown device.",
      type: "error",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isRead: false,
    },
    {
      id: "6",
      title: "Backup Completed",
      message: "Your data has been successfully backed up.",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const handleDeleteNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />;
      case "warning":
        return <AlertCircle size={16} style={{ color: 'var(--color-warning)' }} />;
      case "error":
        return <X size={16} style={{ color: 'var(--color-error)' }} />;
      default:
        return <Info size={16} style={{ color: 'var(--color-info)' }} />;
    }
  };

  return (
    <div
      ref={notificationRef}
      className={`transformable-notification ${isExpanded ? "transformable-notification--expanded" : ""} ${className}`}
    >
      <button
        onClick={handleToggle}
        className="transformable-notification__button"
        aria-label={
          isExpanded ? t("close_notifications") : t("open_notifications")
        }
        title={isExpanded ? t("close_notifications") : t("open_notifications")}
      >
        <div className="transformable-notification__circle">
          <Bell
            size={20}
            strokeWidth={2}
            className="transformable-notification__icon"
          />
          {unreadCount > 0 && (
            <span className="transformable-notification__badge">
              {unreadCount}
            </span>
          )}

          <div className="transformable-notification__content">
            <div className="notification-panel">
              <div className="notification-panel__header">
                <h3 className="notification-panel__title">
                  {t("notifications")}
                  {unreadCount > 0 && (
                    <span className="notification-panel__count">
                      ({unreadCount})
                    </span>
                  )}
                </h3>
                <div className="notification-panel__actions">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="notification-panel__action-btn"
                      title={t("mark_all_as_read")}
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="notification-panel__action-btn"
                      title={t("clear_all")}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="notification-panel__list">
                {notifications.length === 0 ? (
                  <div className="notification-panel__empty">
                    <Bell
                      size={48}
                      className="notification-panel__empty-icon"
                    />
                    <p className="notification-panel__empty-text">
                      {t("no_notifications")}
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-panel__item ${!notification.isRead ? "notification-panel__item--unread" : ""}`}
                    >
                      <div className="notification-panel__item-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-panel__item-content">
                        <div className="notification-panel__item-header">
                          <h4 className="notification-panel__item-title">
                            {notification.title}
                          </h4>
                          <span className="notification-panel__item-time">
                            <Clock size={12} />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="notification-panel__item-message">
                          {notification.message}
                        </p>
                      </div>
                      <div className="notification-panel__item-actions">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="notification-panel__item-action"
                            title={t("mark_as_read")}
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="notification-panel__item-action"
                          title={t("delete")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
