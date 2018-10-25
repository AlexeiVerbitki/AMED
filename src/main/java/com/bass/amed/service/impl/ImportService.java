package com.bass.amed.service.impl;

import com.bass.amed.entity.ImportAuthorizationEntity;
import com.bass.amed.entity.MedicamentEntity;
import com.bass.amed.repository.ImportRepository;
import com.bass.amed.repository.MedicamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.beans.Transient;

@Service
public class ImportService {

	@Autowired
	ImportRepository importRepository;

	@Transactional
	public ImportAuthorizationEntity saveImport(ImportAuthorizationEntity importAuthorizationEntity)
	{
		return importRepository.save(importAuthorizationEntity);
	}




}
