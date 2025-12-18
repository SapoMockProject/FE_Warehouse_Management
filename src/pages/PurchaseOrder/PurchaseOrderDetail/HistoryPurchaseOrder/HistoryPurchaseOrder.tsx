import React from "react";
import type { HistoryPurchaseOrder } from "../../../../types/HistoryPurchaseOrder";
import "./HistoryPurchaseOrder.css";

export const PurchaseOrderHistory: React.FC<{ histories: HistoryPurchaseOrder[] }> = ({ histories }) => {
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("vi-VN");
    };
    const groupedHistories = histories.reduce((groups, history) => {
        const date = formatDate(history.createdDate);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(history);
        return groups;
    }, {} as Record<string, HistoryPurchaseOrder[]>);

    return (
        <div className="po-history-section">
            <h3 className="po-history-title">Lịch sử đơn đặt hàng nhập</h3>

            {histories.length != 0 && (
                <div className="po-history-timeline">
                    {Object.entries(groupedHistories).map(([date, items]) => (
                        <div key={date} className="po-history-date-group">
                            <div className="po-history-date">{date}</div>

                            {items.map((item, index) => (
                                <div key={item.id} className="po-history-item">
                                    <div className="po-history-timeline-marker">
                                        <div className="po-history-dot"></div>
                                        {index < items.length - 1 && (
                                            <div className="po-history-line"></div>
                                        )}
                                    </div>

                                    <div className="po-history-content">
                                            <span className="po-history-time">
                                                {formatTime(item.createdDate)}
                                            </span>

                                            <span
                                                className="po-history-action"
                                                dangerouslySetInnerHTML={{ __html: item.message }}
                                            />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>)}
        </div>
    );
};