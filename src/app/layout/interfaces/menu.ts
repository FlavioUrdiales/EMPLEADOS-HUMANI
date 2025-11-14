/*{
    "response": true,
    "message": "Menú generado correctamente",
    "data": [
        {
            "label": "Home",
            "items": [
                {
                    "label": "Dashboard",
                    "icon": "pi pi-fw pi-home",
                    "routerLink": [
                        "/"
                    ]
                }
            ]
        },
        {
            "label": "Permisos",
            "items": [
                {
                    "label": "Solicitud de Permiso",
                    "icon": "pi pi-fw pi-file",
                    "routerLink": [
                        "/pages/permiso/solicitud"
                    ]
                },
                {
                    "label": "Autorizaciones",
                    "icon": "pi pi-fw pi-check-square",
                    "routerLink": [
                        "/pages/permiso/autorizaciones"
                    ]
                }
            ]
        },
        {
            "label": "Nómina",
            "items": [
                {
                    "label": "Incidencias",
                    "icon": "pi pi-fw pi-calendar-times",
                    "routerLink": [
                        "/pages/nomina/incidencias"
                    ]
                },
                {
                    "label": "Días Festivos",
                    "icon": "pi pi-fw pi-calendar-plus",
                    "routerLink": [
                        "/pages/nomina/diasfestivos"
                    ]
                },
                {
                    "label": "Nóminas",
                    "icon": "pi pi-fw pi-money-bill",
                    "routerLink": [
                        "/pages/nomina/nominas"
                    ]
                }
            ]
        },
        {
            "label": "Usuarios",
            "items": [
                {
                    "label": "Relación de Usuarios",
                    "icon": "pi pi-fw pi-users",
                    "routerLink": [
                        "/pages/usuarios/usuarios"
                    ]
                },
                {
                    "label": "Quincenas",
                    "icon": "pi pi-fw pi-money-bill",
                    "routerLink": [
                        "/pages/nomina/quincenas"
                    ]
                }
            ]
        }
    ]
}*/


export interface MenuResponse {
    response: boolean;
    message: string;
    data: MenuItem[];
}

export interface MenuItem {
    label: string;
    icon?: string;
    routerLink?: string[];
    items?: MenuItem[];
    separator?: boolean;
}
