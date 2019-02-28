package com.bass.amed.controller.rest;

import com.bass.amed.entity.ImportAuthCodeSquenceEntity;
import com.bass.amed.entity.sequence.SeqGDPCertificateNumberEntity;
import com.bass.amed.entity.sequence.SeqGMPRequestNumberEntity;
import com.bass.amed.entity.sequence.SeqMedicamentPostAuthorizationRequestNumberEntity;
import com.bass.amed.entity.sequence.SeqMedicamentRegistrationRequestNumberEntity;
import com.bass.amed.repository.ImportAuthSeqNumberRepository;
import com.bass.amed.repository.sequence.SeqGDPCertificateNrRepository;
import com.bass.amed.repository.sequence.SeqGMPRequestNumberRepository;
import com.bass.amed.repository.sequence.SeqMedicamentPostAuthorizationRequestNumberRepository;
import com.bass.amed.repository.sequence.SeqMedicamentRegistrationRequestNumberRepository;
import com.bass.amed.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/administration")
public class SequenceGeneratorController
{
    @Autowired
    private SeqGMPRequestNumberRepository                         seqGMPRequestNumberRepository;
    @Autowired
    private SeqGDPCertificateNrRepository                         seqGDPCertificateNrRepository;
    @Autowired
    private SeqMedicamentRegistrationRequestNumberRepository      seqMedicamentRegistrationRequestNumberRepository;
    @Autowired
    private SeqMedicamentPostAuthorizationRequestNumberRepository seqMedicamentPostAuthorizationRequestNumberRepository;
    @Autowired
    private ImportAuthSeqNumberRepository importAuthSeqNumberRepository;

    @GetMapping(value = "/generate-gmp-request-number")
    public ResponseEntity<List<String>> generateGMPRequestNumber()
    {
        SeqGMPRequestNumberEntity seq = new SeqGMPRequestNumberEntity();
        seqGMPRequestNumberRepository.save(seq);
        return new ResponseEntity<>(Arrays.asList("Rg09-" + Utils.intToString(6, seq.getId())), HttpStatus.OK);
    }

    @GetMapping(value = "/generate-gdp-certificate-number")
    public ResponseEntity<List<String>> generateGDPCertificateNumber()
    {
        SeqGDPCertificateNumberEntity seq = new SeqGDPCertificateNumberEntity();
        seqGDPCertificateNrRepository.save(seq);
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        int    year              = cal.get(Calendar.YEAR);
        String certificateNumber = String.format("AMDM.MD.GDP.H.%s.%s", Utils.intToString(4, seq.getId()), year);
        return new ResponseEntity<>(Arrays.asList(certificateNumber), HttpStatus.OK);
    }

    @GetMapping(value = "/generate-medicament-registration-request-number")
    public ResponseEntity<List<String>> generateMedicamentRegistrationRequestNumber()
    {
        SeqMedicamentRegistrationRequestNumberEntity seq = new SeqMedicamentRegistrationRequestNumberEntity();
        seqMedicamentRegistrationRequestNumberRepository.save(seq);
        return new ResponseEntity<>(Arrays.asList("Rg06-" + Utils.intToString(6, seq.getId())), HttpStatus.OK);
    }

    @GetMapping(value = "/generate-medicament-post-authorization-request-number")
    public ResponseEntity<List<String>> generateMedicamentPostauthorizationRequestNumber()
    {
        SeqMedicamentPostAuthorizationRequestNumberEntity seq = new SeqMedicamentPostAuthorizationRequestNumberEntity();
        seqMedicamentPostAuthorizationRequestNumberRepository.save(seq);
        return new ResponseEntity<>(Arrays.asList("Rg16-" + Utils.intToString(6, seq.getId())), HttpStatus.OK);
    }

    @RequestMapping(value = "/generate-import-auth-doc-nr")
    public ResponseEntity<List<String>> generateImportAuthDocNr()
    {
        ImportAuthCodeSquenceEntity seq = new ImportAuthCodeSquenceEntity();
        importAuthSeqNumberRepository.save(seq);
        return new ResponseEntity<>(Arrays.asList("Rg15-" + Utils.intToString(6, seq.getId())), HttpStatus.OK);
    }
}
