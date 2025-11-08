import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Nominas by
        <a href="https://unimundial.edu.mx" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">UHM</a>
    </div>`
})
export class AppFooter {}
