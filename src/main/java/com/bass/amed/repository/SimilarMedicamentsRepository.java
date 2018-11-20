package com.bass.amed.repository;

import com.bass.amed.dto.PricesDTO;
import com.bass.amed.dto.SimilarMedicamentDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public interface SimilarMedicamentsRepository extends JpaRepository<SimilarMedicamentDTO, Integer>
{

    @Query(value = "select m.id                  id,\n" +
            "       m.code                code,\n" +
            "       m.name                name,\n" +
            "       npf.description       pharmaceuticalForm,\n" +
            "       m.dose                dose,\n" +
            "       m.division            division,\n" +
            "       c.description         country,\n" +
            "       nm.description        manufacture,\n" +
            "       imn.description       internationalName,\n" +
            "       p.id                  priceId,\n" +
            "       p.value               price,\n" +
            "       cur.short_description currency,\n" +
            "       p.mdl_value           mdlValue\n" +
            "FROM medicament m\n" +
            "       left join nm_pharmaceutical_forms npf on m.pharmaceutical_form_id = npf.id\n" +
            "       left join nm_countries c on m.country_id = c.id\n" +
            "       left join medicament_manufactures mm on m.id = mm.medicament_id\n" +
            "       left join nm_manufactures nm on mm.manufacture_id = nm.id\n" +
            "       left join nm_international_medicament_names imn on m.international_name_id = imn.id\n" +
            "       left join prices p on p.medicament_id = m.id\n" +
            "       left join nm_currencies cur on p.currency_id = cur.id\n" +
            "where international_name_id = ?1\n" +
            "  and mm.producator_produs_finit = 1\n" +
            "group by priceId"            , nativeQuery = true)
    List<SimilarMedicamentDTO> getSimilarMedicaments(Integer internationalNameId);


}
