package com.bass.amed.service;

import com.bass.amed.common.Constants;
import com.bass.amed.entity.sequence.*;
import com.bass.amed.repository.sequence.*;
import com.bass.amed.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SequenceGeneratorService
{
    @Autowired
    private SeqInLetterRepository    seqInLetterRepository;
    @Autowired
    private SeqOutLetterRepository   seqOutLetterRepository;
    @Autowired
    private SeqInternOrderRepository seqInternOrderRepository;
    @Autowired
    private SeqInternDispRepository  seqInternDispRepository;
    @Autowired
    private SeqPetitionRepository    seqPetitionsRepository;

    public String generateIncomingLetterSequence(String prefix)
    {
        LOGGER.info("Start generating sequence for SeqInLetterEntity");
        SeqInLetterEntity seq = seqInLetterRepository.save(new SeqInLetterEntity());
        return prefix + Constants.DEFAULT_VALUES.STR_DASH + Utils.intToString(6, seq.getId());
    }

    public String generateOutgoingLetterSequence(String prefix)
    {
        LOGGER.info("Start generating sequence for SeqOutLetterEntity");
        SeqOutLetterEntity seq = seqOutLetterRepository.save(new SeqOutLetterEntity());
        return prefix + Constants.DEFAULT_VALUES.STR_DASH + Utils.intToString(6, seq.getId());
    }

    public String generateInternOrderSequence(String prefix)
    {
        LOGGER.info("Start generating sequence for SeqInLetterEntity");
        SeqInternOrderEntity seq = seqInternOrderRepository.save(new SeqInternOrderEntity());
        return prefix + Constants.DEFAULT_VALUES.STR_DASH + Utils.intToString(6, seq.getId());
    }

    public String generateInternDispSequence(String prefix)
    {
        LOGGER.info("Start generating sequence for SeqInternDispEntity");
        SeqInternDispEntity seq = seqInternDispRepository.save(new SeqInternDispEntity());
        return prefix + Constants.DEFAULT_VALUES.STR_DASH + Utils.intToString(6, seq.getId());
    }

    public String generatePetitionSequence(String prefix)
    {
        LOGGER.info("Start generating sequence for SeqPetitionsEntity");
        SeqPetitionsEntity seq = seqPetitionsRepository.save(new SeqPetitionsEntity());
        return prefix + Constants.DEFAULT_VALUES.STR_DASH + Utils.intToString(6, seq.getId());
    }
}
