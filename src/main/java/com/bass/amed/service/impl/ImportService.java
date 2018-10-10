package com.bass.amed.service.impl;

import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.repository.MedicamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.beans.Transient;

@Service public class ImportService {

	@Autowired
	MedicamentRepository medicamentRepository;

	@Transactional
	public MedicamentEntity saveImport(MedicamentEntity medicament)
	{
		return medicamentRepository.save(medicament);
	}




}
