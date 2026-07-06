import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
})
export class LandingComponent {

  features = [
    {
      title: 'صفحة متجر باسمك',
      desc:  'رابط خاص بمتجرك يقدر عميلك يدخله ويشوف منتجاتك وأسعارك بشكل منظم.',
      iconPath: 'fa-solid fa-store',
    },
    {
      title: 'إدارة منتجات سهلة',
      desc:  'ضيف، عدّل، أو احذف منتج في ثواني — صور، سعر، كمية متوفرة، كل ده من لوحة تحكم واحدة.',
      iconPath: 'fa-solid fa-box-open',
    },
    {
      title: 'طلبات تجيلك مباشرة',
      desc:  'كل طلب بيوصلك بتفاصيله كاملة، وتقدر تأكده أو ترفضه، وتتابع حالته لحد التوصيل.',
      iconPath: 'fa-solid fa-bell',
    },
  ];

  steps = [
    {
      num:   '1',
      title: 'افتح حساب متجرك',
      desc:  'اكتب اسم متجرك واختار رابطه الخاص، وحساب الأدمن بيتعمل تلقائي.',
    },
    {
      num:   '2',
      title: 'ضيف منتجاتك',
      desc:  'اسم، صورة، سعر، وكمية المتاح — وتقدر تتابع المخزون من نفس الشاشة.',
    },
    {
      num:   '3',
      title: 'استقبل وأكّد الطلبات',
      desc:  'كل طلب يظهرلك في لوحة التحكم، تقبله أو ترفضه، وتتابعه لحد ما يوصل العميل.',
    },
  ];
}