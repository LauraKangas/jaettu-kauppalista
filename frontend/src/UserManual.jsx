import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack'

const UserManual = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <Button
        onClick={() => navigate('/')}
        style={{ marginTop: '20px' }}
      >
        <ArrowBack />Takaisin
      </Button>
      <h1>Käyttäjäopas</h1>
      <p>
        Tämä opas auttaa sinua käyttämään sovellusta. Seuraamalla ohjeita voit hyödyntää kaikkia toimintoja ja saada kaiken irti sovelluksesta.
      </p>

      <h2>Sisäänkirjautuminen</h2>
      <p>
        - Kirjaudu sisään käyttämällä henkilökohtaista käyttäjäkoodiasi.<br />
        - Jos sinulla ei vielä ole koodia, voit luoda uuden "Luo käyttäjäkoodi" -painikkeella.<br />
        - Laita käyttäjäkoodisi talteen, sillä se on henkilökohtainen. <br />
        - Koodisi tallennetaan automaattisesti, joten sinun ei tarvitse kirjautua jokaisella kerralla uudellee, mikäli käytät samaa laitetta.<br />
        - Huomioi kuitenkin, että uloskirjautuminen poistaa käyttäjäistuntosi muistista. <br />
        - Yksityisen selauksen käyttö edellyttää kirjautumista jokaisella kerralla.
      </p>

      <h2>Listojen luominen</h2>
      <p>
        - Pääsivulla voit luoda uuden listan syöttämällä listan nimen ja painamalla "Luo lista" -painiketta.<br />
        - Voit antaa listallesi yksilöllisen nimen, jonka avulla voit hallinnoida tehtäviäsi tehokkaammin. <br />
        - Jos poistat listan, joka on jaettu, poistuu se kaikilta välittömästi. Listan merkitseminen suosikiksi tai sen piilottaminen ei vaikuta muihin käyttäjiin.<br />
      </p>

      <h2>Listojen muokkaaminen</h2>
      <p>
        - Klikkaamalla listan nimeä pääset tarkastelemaan sen sisältöä.<br />
        - Voit lisätä, muokata tai poistaa kohteita listaltasi. Näet myös kuinka monella on pääsy listalle Voit myös muokata listan nimeä.<br />
        - Kohteiden muokkaaminen on yksinkertaista ja nopeaa, joten tehtäväsi pysyvät aina ajan tasalla.<br />
        - Mikäli lista on jaettu ystäviesi kesken, muokkauksen vaikutukset näkyvät kaikille välittömästi.<br />
      </p>

      <h2>Listojen jakaminen</h2>
      <p>
        - Käytä listan koodia jakaaksesi listasi muiden käyttäjien kanssa.<br />
        - Näet luomasi listan koodin, kun avaat listan painamalla sen nimeä. Koodi on helppo myös kopioida leikepöydälle. <br />
        - Vastaanottajat voivat liittyä listalle syöttämällä sen koodin sovelluksessa.<br />
        - Tämä mahdollistaa tiimityön ja listojen yhteiskäytön helposti.<br />
      </p>

      <h2>Listojen hallinta</h2>
      <p>
        - Voit merkitä listat suosikeiksi painamalla tähden kuvaketta. Suosikkilistat nousevat automaattisesti ylimmäksi.<br />
        - Jos haluat piilottaa listan, klikkaa silmäkuvaketta. Piilotettu lista ei näy enää päänäkymässä.<br />
        - Kun listan käyttö tulee taas ajankohtaiseksi, on sen palauttaminen helppoa. Painat vain listan nimen perässä olevaa silmän kuvaketta. <br /> 
        - Näitä asetuksia voit muokata milloin tahansa.<br />
      </p>

      <h2>Käyttäjätilin hallinta</h2>
      <p>
        - Kirjautuessasi ulos käyttäjätilistäsi, sinun on annettava koodi uudelleen seuraavalla kerralla.<br />
        - Käyttäjäkoodin palauttaminen ei ole mahdollista, joten laita koodinumerosi talteen. <br />
        - Mikäli hukkaat oman käyttäjäkoodisi lopullisesti, uuden koodin luonti on helppoa. Unphdetun koodin palauttaminen ei ole mahdollista.<br />
      </p>

      <h2>Ongelmatilanteet</h2>
      <p>
        - Jos kohtaat ongelmia, varmista ensin, että internet-yhteytesi toimii.<br />
        - Mikäli ongelmat jatkuvat, yritä kirjautua ulos ja sisään uudelleen.<br />
      </p>

      <h2>Tietosuoja</h2>
      <p>
        - Käyttäjäkoodin luominen ei vaadi henkilötietoja tai salasanaa. Tämän vuoksi käyttäjäkoodin palauttaminen ei ole mahdollista.<br />
        - Ethän tallenna sovellukseen mitään yksilöivää tietoa, henkilötietoja, pankkitunnuksia tai salasanoja.<br />
      </p>
    </div>
  );
};

export default UserManual;
