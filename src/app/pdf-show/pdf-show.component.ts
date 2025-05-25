import { Component } from '@angular/core';

@Component({
  selector: 'app-pdf-show',
  templateUrl: './pdf-show.component.html',
  styleUrls: ['./pdf-show.component.css']
})
export class PdfShowComponent {

  page = 1;
totalPages = 0;
zoom = 1.0;

afterLoadComplete(pdf: any) {
  this.totalPages = pdf.numPages;
}

nextPage() {
  if (this.page < this.totalPages) this.page++;
}

prevPage() {
  if (this.page > 1) this.page--;
}

downloadPDF() {
  const link = document.createElement('a');
  link.href = 'assets/file.pdf';
  link.download = 'document.pdf';
  link.click();
}

printPDF() {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'assets/file.pdf';
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow?.print();
  };
}

}
