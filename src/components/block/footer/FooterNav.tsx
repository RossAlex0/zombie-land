import TextZbl from '@components/ui/textZbl/TextZbl';
import Link from 'next/link';

type FooterNavProps = {
  title: string;
  links: { label: string; href: string }[];
};
export default function FooterNav({ title, links }: FooterNavProps) {
  return (
    <>
      <TextZbl redPrefix="//" color="red">
        {title}
      </TextZbl>
      {links.map((link) => (
        <Link href={link.href} key={link.label} className="footer_nav_text">
          {link.label}
        </Link>
      ))}
    </>
  );
}
