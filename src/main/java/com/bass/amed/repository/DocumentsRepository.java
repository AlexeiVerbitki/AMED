package com.bass.amed.repository;

import com.bass.amed.entity.DocumentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface DocumentsRepository  extends JpaRepository<DocumentsEntity, Integer>
{
    @Query("SELECT d FROM DocumentsEntity d WHERE d.id in (:ids)")
    List<DocumentsEntity> findAllByIds(@Param("ids") List<Integer> docIds);

    @Query("SELECT p.documents FROM PricesEntity p WHERE p.id in (:ids)")
    List<DocumentsEntity> findAllByPriceIds(@Param("ids") List<Integer> docIds);

    @Query("SELECT D FROM RegistrationRequestsEntity R LEFT JOIN R.documents D LEFT JOIN R.price P WHERE P.id IN (:ids)")
    List<DocumentsEntity> findAllByPriceRequestsIds(@Param("ids") List<Integer> priceReqIds);

    Set<DocumentsEntity> findAllByregistrationRequestId(int priceReqIds);
}
