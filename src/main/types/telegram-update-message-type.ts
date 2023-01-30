export type TelegramUpdateMessage = {
    message: {
        from: {
            id: number,
            first_name: string
        }
        text: string
    }
}