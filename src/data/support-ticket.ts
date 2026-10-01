import type { GuestRequest } from "@/data/contracts/guest-request";
import type {
  SupportTicket,
  SupportTicketStatus,
} from "@/data/contracts/support";

const statusLabels: Record<SupportTicketStatus, string> = {
  accepted: "Принят",
  assigned: "Назначен исполнитель",
  en_route: "Специалист в пути",
  resolved: "Решён",
};

export function getSupportTicketStatusLabel(status: SupportTicketStatus) {
  return statusLabels[status];
}

export function guestRequestToSupportTicket(
  request: GuestRequest,
): SupportTicket {
  const categoryMatch = request.message.match(/^\[([^\]]+)\]\s*/);
  const category = categoryMatch?.[1] ?? "Общий вопрос";
  const title = request.message.replace(/^\[[^\]]+\]\s*/, "");
  const status: SupportTicketStatus =
    request.status === "done"
      ? "resolved"
      : request.status === "in_progress"
        ? "assigned"
        : "accepted";
  const acceptedTime = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Astrakhan",
  }).format(new Date(request.createdAt));

  return {
    id: request.id,
    title,
    category,
    createdAt: request.createdAt,
    status,
    eta:
      status === "resolved"
        ? "Обращение закрыто"
        : status === "assigned"
          ? "Исполнитель уточняет время прибытия"
          : "Назначим исполнителя в ближайшее время",
    assignedTo: status === "accepted" ? undefined : "Специалист службы заботы",
    assigneeImage:
      status === "accepted" ? undefined : "/team/care-specialist.webp",
    updates: [
      {
        status: "accepted",
        title: "Обращение принято",
        detail: "Служба заботы получила описание проблемы.",
        time: acceptedTime,
        completed: true,
      },
      {
        status: "assigned",
        title: "Назначен исполнитель",
        detail: "Сообщим имя специалиста и время прибытия после назначения.",
        time: status === "accepted" ? "Ожидается" : "Исполнитель подключился",
        completed: status !== "accepted",
      },
      {
        status: "resolved",
        title: "Проблема решена",
        detail: "После выполнения работ обращение можно закрыть.",
        time: status === "resolved" ? "Готово" : "Ожидается",
        completed: status === "resolved",
      },
    ],
  };
}
