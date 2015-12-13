<?php

/**
 * @see Kohut_SNMP_Abstract
 */
 require_once '/Abstract.php';

/**
 * Class for getting information about printer by SNMP protocol
 * This class has dependency on PHP extension "php_snmp.dll"
 *
 * @version    v0.11    2011-08-31
 * @author     Petr Kohut <me@petrkohut.cz>    -    http://www.petrkohut.cz
 * @category   Kohut
 * @package    Kohut_SNMP
 * @copyright  Copyright (c) 2011 - Petr Kohut
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 */
class Kohut_SNMP_Printer extends Kohut_SNMP_Abstract
{

    /**
     * Printer types
     */
    const PRINTER_TYPE_MONO  = 'SW';
    const PRINTER_TYPE_COLOR = 'CO';

    /**
     * Printer colors
     */
    const CARTRIDGE_COLOR_CYAN    = 'cyan';
    const CARTRIDGE_COLOR_MAGENTA = 'magenta';
    const CARTRIDGE_COLOR_YELLOW  = 'yellow';
    const CARTRIDGE_COLOR_BLACK   = 'black';

    /**
     * SNMP MARKER_SUPPLIES possible results
     */
    const MARKER_SUPPLIES_UNAVAILABLE    = -1;
    const MARKER_SUPPLIES_UNKNOWN        = -2;
    const MARKER_SUPPLIES_SOME_REMAINING = -3; // means that there is some remaining but unknown how much

    /**
     * SNMP printer object ids
     */
    const SNMP_PRINTER_FACTORY_ID                     = '.1.3.6.1.2.1.1.1.0';
    const SNMP_PRINTER_RUNNING_TIME                   = '.1.3.6.1.2.1.1.3.0';  
    const SNMP_PRINTER_SERIAL_NUMBER                  = '.1.3.6.1.2.1.43.5.1.1.17.1';
    const SNMP_PRINTER_VENDOR_NAME                    = '.1.3.6.1.2.1.43.9.2.1.8.1.1';
    const SNMP_NUMBER_OF_PRINTED_PAPERS               = '.1.3.6.1.2.1.43.10.2.1.4.1.1';

    const SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOTS     = '.1.3.6.1.2.1.43.11.1.1.8.1';
    const SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_1    = '.1.3.6.1.2.1.43.11.1.1.8.1.1';
    const SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_2    = '.1.3.6.1.2.1.43.11.1.1.8.1.2';
    const SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_3    = '.1.3.6.1.2.1.43.11.1.1.8.1.3';
    const SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_4    = '.1.3.6.1.2.1.43.11.1.1.8.1.4';
    const SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_5    = '.1.3.6.1.2.1.43.11.1.1.8.1.5';

    const SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOTS  = '.1.3.6.1.2.1.43.11.1.1.9.1';
    const SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_1 = '.1.3.6.1.2.1.43.11.1.1.9.1.1';
    const SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_2 = '.1.3.6.1.2.1.43.11.1.1.9.1.2';
    const SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_3 = '.1.3.6.1.2.1.43.11.1.1.9.1.3';
    const SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_4 = '.1.3.6.1.2.1.43.11.1.1.9.1.4';
    const SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_5 = '.1.3.6.1.2.1.43.11.1.1.9.1.5';

    const SNMP_SUB_UNIT_TYPE_SLOTS                    = '.1.3.6.1.2.1.43.11.1.1.6.1';
    const SNMP_SUB_UNIT_TYPE_SLOT_1                   = '.1.3.6.1.2.1.43.11.1.1.6.1.1';
    const SNMP_SUB_UNIT_TYPE_SLOT_2                   = '.1.3.6.1.2.1.43.11.1.1.6.1.2';
    const SNMP_SUB_UNIT_TYPE_SLOT_3                   = '.1.3.6.1.2.1.43.11.1.1.6.1.3';
    const SNMP_SUB_UNIT_TYPE_SLOT_4                   = '.1.3.6.1.2.1.43.11.1.1.6.1.4';

	
	// gibt den Typen des SLOTS zurück
    const SNMP_CARTRIDGE_COLOR_SLOT_1                 = '.1.3.6.1.2.1.43.12.1.1.4.1.1';
    const SNMP_CARTRIDGE_COLOR_SLOT_2                 = '.1.3.6.1.2.1.43.12.1.1.4.1.2';
    const SNMP_CARTRIDGE_COLOR_SLOT_3                 = '.1.3.6.1.2.1.43.12.1.1.4.1.3';
    const SNMP_CARTRIDGE_COLOR_SLOT_4                 = '.1.3.6.1.2.1.43.12.1.1.4.1.4';
	
	public $blackslot;
	public $magentaslot;
	public $cyanslot;
	public $yellowslot;

    /**
     * Function gets and return what type of printer we are working with,
     * or returns false if error occurred
     *
     * @return string Type of printer (PRINTER_TYPE_MONO|PRINTER_TYPE_COLOR)
     */
    public function getTypeOfPrinter(){
        $colorCartridgeSlot1 = $this->getSNMPString(self::SNMP_CARTRIDGE_COLOR_SLOT_1);
        $colorCartridgeSlot2 = $this->getSNMPString(self::SNMP_CARTRIDGE_COLOR_SLOT_2);
        $colorCartridgeSlot3 = $this->getSNMPString(self::SNMP_CARTRIDGE_COLOR_SLOT_3);
        $colorCartridgeSlot4 = $this->getSNMPString(self::SNMP_CARTRIDGE_COLOR_SLOT_4);
		$getColorslots = array($colorCartridgeSlot1,$colorCartridgeSlot2,$colorCartridgeSlot3,$colorCartridgeSlot4);

		foreach($getColorslots as $index => $colorstring){
			if(strpos(strtolower($colorstring),self::CARTRIDGE_COLOR_BLACK) > 1 ){
				$this->blackslot = "SLOT_".($index+1);
			}			
			if(strpos(strtolower($colorstring),self::CARTRIDGE_COLOR_CYAN) > 1 ){
				$this->cyanslot = "SLOT_".($index+1);
			}			
			if(strpos(strtolower($colorstring),self::CARTRIDGE_COLOR_MAGENTA) > 1 ){
				$this->magentaslot = "SLOT_".($index+1);
			}			
			if(strpos(strtolower($colorstring),self::CARTRIDGE_COLOR_YELLOW) > 1 ){
				$this->yellowslot = "SLOT_".($index+1);
			}
		}
		if(!isset($this->blackslot)){
          return "unerreichbar";
		}
        if(!isset($this->cyanslot)) {
          return self::PRINTER_TYPE_MONO;
       } else {
           return self::PRINTER_TYPE_COLOR;
        }
   //     }

   //     return false;
    }

    /**
     * Function returns true if it is color printer
     *
     * @return boolean
     */
    public function isColorPrinter()
    {
        $type = $this->getTypeOfPrinter();
        if ($type !== false) {
            return ($type === self::PRINTER_TYPE_COLOR) ? true : false;
        } else {
            return false;
        }
    }

    /**
     * Function returns true if it is color printer
     *
     * @return boolean
     */
    public function isMonoPrinter()
    {
        $type = $this->getTypeOfPrinter();
        if ($type !== false) {
            return ($type === self::PRINTER_TYPE_MONO) ? true : false;
        } else {
            return false;
        }
    }

    /**
     * Function gets factory id (name) of the printer,
     * or returns false if call failed
     *
     * @return string|boolean
     */
    public function getFactoryId()
    {
        return $this->getSNMPString(self::SNMP_PRINTER_FACTORY_ID);
    }

    /**
     * Function gets vendor name of printer
     *
     * @return string|boolean
     */
    public function getVendorName()
    {
        return $this->getSNMPString(self::SNMP_PRINTER_VENDOR_NAME);
    }

    /**
     * Function gets serial number of printer
     *
     * @return string|boolean
     */
    public function getSerialNumber()
    {
        return $this->getSNMPString(self::SNMP_PRINTER_SERIAL_NUMBER);
    }

    /**
     * Function gets a count of printed papers,
     * or returns false if call failed
     *
     * @return int|boolean
     */
    public function getNumberOfPrintedPapers()
    {
        snmp_set_quick_print(true);
        $numberOfPrintedPapers = $this->get(self::SNMP_NUMBER_OF_PRINTED_PAPERS);
        snmp_set_quick_print(false);

        return ($numberOfPrintedPapers !== false) ? (int) $numberOfPrintedPapers : false;
    }

    /**
     * Function gets description about black catridge of the printer,
     * or returns false if call failed
     *
     * @return string|boolean
     */
    public function getBlackCatridgeType()
    {
		switch ($this->blackslot) {
			case "SLOT_1":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_4);
				break;
			default:
				return false;
				break;
		}		
    	
    }

    /**
     * Function gets description about cyan catridge of the printer,
     * or returns false if call failed
     *
     * @return string|boolean
     */
    public function getCyanCatridgeType()
    {
		switch ($this->cyanslot) {
			case "SLOT_1":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_4);
				break;
			default:
				return false;
				break;
		}
	/*	
        if ($this->isColorPrinter()) {
            return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_1);
        } else {
            return false;
        }
	*/
    }

    /**
     * Function gets description about magenta catridge of the printer,
     * or returns false if call failed
     *
     * @return string|boolean
     */
    public function getMagentaCatridgeType()
    {
		switch ($this->magentaslot) {
			case "SLOT_1":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_4);
				break;
			default:
				return false;
				break;
		}	
	/*
        if ($this->isColorPrinter()) {
            return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_2);
        } else {
            return false;
        }
	*/
    }

    /**
     * Function gets description about yellow catridge of the printer,
     * or returns false if call failed
     *
     * @return string|boolean
     */
    public function getYellowCatridgeType(){
		switch ($this->yellowslot) {
			case "SLOT_1":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_4);
				break;
			default:
				return false;
				break;
		}	
	
  /*      if ($this->isColorPrinter()) {
            return $this->getSNMPString(self::SNMP_SUB_UNIT_TYPE_SLOT_3);
        } else {
            return false;
        }
*/
    }

    /**
     * Function gets sub-unit percentage level of the printer,
     * or
     * -1 : MARKER_SUPPLIES_UNAVAILABLE Level is unavailable
     * -2 : MARKER_SUPPLIES_UNKNOWN Level is unknown
     * -3 : MARKER_SUPPLIES_SOME_REMAINING Information about level is only that there is some remaining, but we don't know how much
     *
     * or returns false if call failed
     *
     * @param string $maxValueSNMPSlot SNMP object id
     * @param string $actualValueSNMPSlot SNMP object id
     * @return int|float|boolean
     */
    protected function getSubUnitPercentageLevel($maxValueSNMPSlot, $actualValueSNMPSlot){
		$max = $this->get($maxValueSNMPSlot);
		$actual = $this->get($actualValueSNMPSlot);
		$max = (int)preg_replace("/[^\d]+/","",$max);
		$actual = (int)preg_replace("/[^\d]+/","",$actual);
        if ($max === false || $actual === false) {
            return false;
        }

        if ((int) $actual <= 0) {

            /**
             * Actual level of drum is unavailable, unknown or some unknown remaining
             */
            return (int) $actual;
        } else {

            /**
             * Counting result in percent format
             */
		//	 echo "in3";
            return ($actual / ($max / 100));
        }
    }

    /**
     * Function gets actual level of black toner (in percents)
     * or returns false if call failed
     *
     * @see getSubUnitPercentageLevel
     * @return int|float|boolean
     */
    public function getBlackTonerLevel(){

		switch ($this->blackslot) {
			case "SLOT_1":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_1,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_2,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_3,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_4,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_4);
				break;
			default:
				return false;
				break;
		}	

    }

    /**
     * Function gets actual level of cyan toner (in percents)
     * or returns false if call failed
     *
     * @see getSubUnitPercentageLevel
     * @return int|float|boolean
     */
    public function getCyanTonerLevel(){
		switch ($this->cyanslot) {
			case "SLOT_1":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_1,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_2,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_3,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_4,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_4);
				break;
			default:
				return false;
				break;
		}		
    }

    /**
     * Function gets actual level of magenta toner (in percents)
     * or returns false if call failed
     *
     * @see getSubUnitPercentageLevel
     * @return int|float|boolean
     */
    public function getMagentaTonerLevel(){
		switch ($this->magentaslot) {
			case "SLOT_1":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_1,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_2,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_3,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_4,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_4);
				break;
			default:
				return false;
				break;
		}	
    }

    /**
     * Function gets actual level of yellow toner (in percents)
     * or returns false if call failed
     *
     * @see getSubUnitPercentageLevel
     * @return int|float|boolean
     */
    public function getYellowTonerLevel(){
		switch ($this->yellowslot) {
			case "SLOT_1":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_1,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_1);
				break;
			case "SLOT_2":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_2,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_2);
				break;
			case "SLOT_3":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_3,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_3);
				break;			
			case "SLOT_4":
				return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_4,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_4);
				break;
			default:
				return false;
				break;
		}	
    }

    /**
     * Function gets drum level of the printer (in percents)
     * or returns false if call failed
     *
     * @see getSubUnitPercentageLevel
     * @return int|float|boolean
     */
    public function getDrumLevel()
    {
        if ($this->isColorPrinter()) {
            return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_5
                                                   ,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_5);
        } elseif ($this->isMonoPrinter()) {
            return $this->getSubUnitPercentageLevel(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOT_2
                                                   ,self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOT_2);
        } else {
            return false;
        }
    }

    /**
     * Function walks through SNMP object ids of Sub-Units and returns results of them all in array
     * with calculated percentage level
     *
     * @return array
     */
    public function getAllSubUnitData()
    {
        $names        = $this->walk(self::SNMP_SUB_UNIT_TYPE_SLOTS);
        $maxValues    = $this->walk(self::SNMP_MARKER_SUPPLIES_MAX_CAPACITY_SLOTS);
        $actualValues = $this->walk(self::SNMP_MARKER_SUPPLIES_ACTUAL_CAPACITY_SLOTS);

        for ($i = 0; $i < sizeOf($names); $i++) {
            $resultData[] = array('name'            => str_replace('"', '', $names[$i])
                                 ,'maxValue'        => $maxValues[$i]
                                 ,'actualValue'     => $actualValues[$i]
                                 ,'percentageLevel' => ((int)$actualValues[$i] >= 0) ? ($actualValues[$i] / ($maxValues[$i] / 100)) : null);
        }
        return $resultData;
    }

}