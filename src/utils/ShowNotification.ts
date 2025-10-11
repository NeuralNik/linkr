export async function showNotification(title: string, description: string, icon?: string ) {
    if (!("Notification" in window)) {
        alert(`${title}\n${description}`);
        return;
    }

    const createNotification = () => {
        const notification = new Notification(title, { body: description, icon });

        setTimeout(() => notification.close(), 10000);
        notification.onclick = () =>  notification.close();
    }

    if (Notification.permission === "granted") {
        createNotification();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                createNotification();
            }
        });
    } else {
        alert(`${title}\n${description}`);
    }
}