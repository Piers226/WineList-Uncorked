import Link from "next/link";

export default function Menu() {
  return (
    <div>
      <h1>Menu</h1>
      <ul>
        <li><Link href="/addWine">Add a Wine</Link></li>
        <li><Link href="/savedWines">View Your Saved Wines</Link></li>
        <li><Link href="/searchWines">Search Wines</Link></li>
        <li><Link href="/topWines">View Top Rated Wines</Link></li>
        <li><Link href="/">Home</Link></li>
      </ul>
    </div>
  );
}