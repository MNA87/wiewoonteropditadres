import Zoek from "@/components/Zoek";

export default function NotFound() {
  return (
    <div className="wrap sec">
      <h1>Dit adres vinden we niet</h1>
      <p className="lead">Controleer de postcode en het huisnummer, of zoek opnieuw.</p>
      <Zoek />
    </div>
  );
}
